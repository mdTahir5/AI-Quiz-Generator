package com.aiquiz.service;

import com.aiquiz.config.OpenRouterConfig;
import com.aiquiz.dto.quiz.QuizQuestionDto;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class OpenRouterService {

    private static final Logger logger = LoggerFactory.getLogger(OpenRouterService.class);

    private final OpenRouterConfig config;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public OpenRouterService(OpenRouterConfig config, RestTemplate restTemplate, ObjectMapper objectMapper) {
        this.config = config;
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
    }

    public List<QuizQuestionDto> generateQuestions(String subject, int count, String difficulty) {
        List<QuizQuestionDto> questions = new ArrayList<>();

        if (StringUtils.hasText(config.getApiKey())) {
            try {
                questions = callOpenRouterApi(subject, count, difficulty);
            } catch (Exception e) {
                logger.warn("OpenRouter API call failed or rate limited: {}. Falling back to curated question generator.", e.getMessage());
                questions = generateCuratedQuestions(subject, count, difficulty);
            }
        } else {
            logger.info("No OpenRouter API key provided. Using curated intelligent questions.");
            questions = generateCuratedQuestions(subject, count, difficulty);
        }

        // Validate generated questions
        List<QuizQuestionDto> validQuestions = validateQuestions(questions, count);
        if (validQuestions.size() < count) {
            // Fill any missing with curated questions
            List<QuizQuestionDto> filler = generateCuratedQuestions(subject, count, difficulty);
            for (QuizQuestionDto f : filler) {
                if (validQuestions.size() >= count) break;
                boolean exists = validQuestions.stream().anyMatch(q -> q.getQuestion().equalsIgnoreCase(f.getQuestion()));
                if (!exists) {
                    f.setId(validQuestions.size() + 1);
                    validQuestions.add(f);
                }
            }
            // If still under count (e.g. subject pool was small), cycle through curated filler to reach count
            int fillIdx = 0;
            while (validQuestions.size() < count && !filler.isEmpty()) {
                QuizQuestionDto template = filler.get(fillIdx % filler.size());
                QuizQuestionDto duplicate = new QuizQuestionDto(
                        validQuestions.size() + 1,
                        template.getQuestion(),
                        template.getOptionA(),
                        template.getOptionB(),
                        template.getOptionC(),
                        template.getOptionD(),
                        template.getCorrectAnswer(),
                        template.getExplanation()
                );
                validQuestions.add(duplicate);
                fillIdx++;
            }
        }

        // Re-index IDs 1..count
        for (int i = 0; i < validQuestions.size(); i++) {
            validQuestions.get(i).setId(i + 1);
        }

        return validQuestions;
    }

    private List<QuizQuestionDto> callOpenRouterApi(String subject, int count, String difficulty) throws Exception {
        String prompt = buildPrompt(subject, count, difficulty);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + config.getApiKey().trim());
        headers.set("HTTP-Referer", config.getSiteUrl());
        headers.set("X-Title", config.getSiteName());

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", config.getModel());
        
        List<Map<String, String>> messages = new ArrayList<>();
        messages.add(Map.of("role", "system", "content", 
                "You are an expert technical computer science professor and quiz master. You strictly return ONLY a raw JSON array of multiple choice questions without markdown code blocks, backticks, or any conversational text."));
        messages.add(Map.of("role", "user", "content", prompt));
        
        requestBody.put("messages", messages);
        requestBody.put("temperature", 0.7);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
        String url = config.getBaseUrl() + "/chat/completions";

        ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);
        if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
            JsonNode root = objectMapper.readTree(response.getBody());
            JsonNode choices = root.path("choices");
            if (choices.isArray() && choices.size() > 0) {
                String content = choices.get(0).path("message").path("content").asText();
                return parseQuestionsFromJson(content);
            }
        }
        throw new RuntimeException("Empty or invalid response from OpenRouter API");
    }

    private String buildPrompt(String subject, int count, String difficulty) {
        return String.format("""
                Generate exactly %d high-quality multiple choice questions (MCQs) for the subject "%s" at "%s" difficulty.
                Requirements:
                1. Every question MUST contain exactly 4 distinct, plausible options labeled: optionA, optionB, optionC, optionD.
                2. Exactly one option must be correct, denoted by "correctAnswer" with single character "A", "B", "C", or "D".
                3. Provide a clear, technical explanation for why that answer is correct.
                4. Output strictly valid JSON array format conforming to this schema without any markdown formatting or commentary:
                [
                  {
                    "id": 1,
                    "question": "Question text here?",
                    "optionA": "Choice A text",
                    "optionB": "Choice B text",
                    "optionC": "Choice C text",
                    "optionD": "Choice D text",
                    "correctAnswer": "A",
                    "explanation": "Detailed explanation of the correct answer."
                  }
                ]
                """, count, subject, difficulty);
    }

    private List<QuizQuestionDto> parseQuestionsFromJson(String rawJson) {
        try {
            String cleaned = rawJson.trim();
            if (cleaned.startsWith("```json")) {
                cleaned = cleaned.substring(7);
            } else if (cleaned.startsWith("```")) {
                cleaned = cleaned.substring(3);
            }
            if (cleaned.endsWith("```")) {
                cleaned = cleaned.substring(0, cleaned.length() - 3);
            }
            cleaned = cleaned.trim();

            int startIndex = cleaned.indexOf('[');
            int endIndex = cleaned.lastIndexOf(']');
            if (startIndex != -1 && endIndex != -1 && endIndex > startIndex) {
                cleaned = cleaned.substring(startIndex, endIndex + 1);
            }

            return objectMapper.readValue(cleaned, new TypeReference<List<QuizQuestionDto>>() {});
        } catch (Exception e) {
            logger.error("Failed to parse JSON questions: {}. Raw content: {}", e.getMessage(), rawJson);
            return Collections.emptyList();
        }
    }

    private List<QuizQuestionDto> validateQuestions(List<QuizQuestionDto> questions, int requiredCount) {
        List<QuizQuestionDto> valid = new ArrayList<>();
        if (questions == null) return valid;

        for (QuizQuestionDto q : questions) {
            if (StringUtils.hasText(q.getQuestion())
                    && StringUtils.hasText(q.getOptionA())
                    && StringUtils.hasText(q.getOptionB())
                    && StringUtils.hasText(q.getOptionC())
                    && StringUtils.hasText(q.getOptionD())
                    && StringUtils.hasText(q.getCorrectAnswer())) {
                
                String ans = q.getCorrectAnswer().trim().toUpperCase();
                if (ans.equals("A") || ans.equals("B") || ans.equals("C") || ans.equals("D")) {
                    q.setCorrectAnswer(ans);
                    if (!StringUtils.hasText(q.getExplanation())) {
                        q.setExplanation("The correct answer is Option " + ans + ".");
                    }
                    valid.add(q);
                }
            }
            if (valid.size() >= requiredCount) break;
        }
        return valid;
    }

    // Curated high quality question bank covering DSA, OS, AI/ML, System Design, CN, CA, DBMS, etc.
    private List<QuizQuestionDto> generateCuratedQuestions(String subject, int count, String difficulty) {
        List<QuizQuestionDto> pool = new ArrayList<>();
        String normalizedSubject = subject.toUpperCase();

        if (normalizedSubject.contains("DSA") || normalizedSubject.contains("DATA STRUCTURE")) {
            pool.add(new QuizQuestionDto(1, "What is the worst-case time complexity of QuickSort?", "O(N log N)", "O(N^2)", "O(N)", "O(log N)", "B", "Worst-case occurs when the selected pivot is the extreme element consistently, causing N recursive levels of N work."));
            pool.add(new QuizQuestionDto(2, "Which data structure is primarily used to implement Breadth-First Search (BFS)?", "Stack", "Queue", "Heap", "Binary Search Tree", "B", "BFS explores vertices level by level using a FIFO Queue."));
            pool.add(new QuizQuestionDto(3, "In an AVL tree, what is the maximum permissible difference between heights of left and right subtrees?", "0", "1", "2", "Unlimited", "B", "An AVL tree maintains a balance factor of -1, 0, or 1 for every node."));
            pool.add(new QuizQuestionDto(4, "What is the time complexity of searching in a balanced Red-Black Tree with N nodes?", "O(1)", "O(log N)", "O(N)", "O(N log N)", "B", "Because Red-Black trees guarantee height at most 2 * log2(N+1), search is strictly O(log N)."));
            pool.add(new QuizQuestionDto(5, "Which algorithm finds the shortest path in a weighted graph with non-negative edge weights?", "Kruskal's Algorithm", "Dijkstra's Algorithm", "Floyd-Warshall Algorithm", "Prim's Algorithm", "B", "Dijkstra's greedy algorithm finds single-source shortest paths efficiently when weights are non-negative."));
            pool.add(new QuizQuestionDto(6, "What is the average time complexity of insertion into a Hash Table with good hash function?", "O(log N)", "O(1)", "O(N)", "O(N^2)", "B", "Hash tables provide average constant O(1) time complexity for insert, lookup, and delete operations."));
            pool.add(new QuizQuestionDto(7, "Which sorting algorithm is guaranteed to be stable and has O(N log N) worst-case time complexity?", "Merge Sort", "Quick Sort", "Heap Sort", "Selection Sort", "A", "Merge Sort divides the array and merges ordered subarrays while preserving relative order of duplicate elements."));
            pool.add(new QuizQuestionDto(8, "What is the auxiliary space complexity of Heap Sort?", "O(N)", "O(log N)", "O(1)", "O(N log N)", "C", "Heap Sort operates in-place on the array, requiring only O(1) auxiliary memory."));
            pool.add(new QuizQuestionDto(9, "Which data structure is optimal for implementing an LRU (Least Recently Used) Cache?", "Array + Stack", "Hash Map + Doubly Linked List", "Binary Heap + Queue", "Trie + Vector", "B", "A Hash Map gives O(1) key lookup while a Doubly Linked List allows O(1) node relocation and eviction."));
            pool.add(new QuizQuestionDto(10, "In a min-heap with N elements, what is the time complexity to extract the minimum element?", "O(1)", "O(log N)", "O(N)", "O(N log N)", "B", "Extracting min takes O(1) to read root, followed by heapify-down taking O(log N) steps."));
            pool.add(new QuizQuestionDto(11, "Which graph traversal can be used to perform Topological Sorting on a Directed Acyclic Graph (DAG)?", "Dijkstra's Algorithm", "Depth-First Search (DFS)", "Prim's Algorithm", "A* Search", "B", "Topological sort orders vertices based on reverse post-order finish times in DFS."));
            pool.add(new QuizQuestionDto(12, "What is the amortized time complexity of inserting into a dynamic array (like Java ArrayList)?", "O(N)", "O(1)", "O(log N)", "O(N^2)", "B", "Resizing doubles capacity; doubling costs spread over N insertions yield O(1) amortized cost."));
        } else if (normalizedSubject.contains("OS") || normalizedSubject.contains("OPERATING")) {
            pool.add(new QuizQuestionDto(1, "Which of the following is NOT one of Coffman's four conditions for deadlock?", "Mutual Exclusion", "Hold and Wait", "Preemption Allowed", "Circular Wait", "C", "The required deadlock condition is 'No Preemption'. If preemption is allowed, deadlock cannot persist."));
            pool.add(new QuizQuestionDto(2, "What is Belady's Anomaly?", "Page fault rate increases as number of page frames increases", "Process priority drops due to aging", "CPU utilization drops during thrashing", "Memory fragmentation increases over time", "A", "Belady's Anomaly occurs in FIFO page replacement where adding physical page frames can increase page faults."));
            pool.add(new QuizQuestionDto(3, "In Unix/Linux, which system call creates a new duplicate process?", "exec()", "fork()", "clone()", "pthread_create()", "B", "The fork() system call clones the parent process into a child process with a distinct PID."));
            pool.add(new QuizQuestionDto(4, "What is thrashing in an operating system?", "High disk I/O due to excessive paging where system spends more time paging than executing", "CPU overheating under intensive compute tasks", "Corrupted file system inodes", "Deadlock caused by memory leaks", "A", "Thrashing happens when the total working set exceeds available physical memory, creating continuous page faults."));
            pool.add(new QuizQuestionDto(5, "Which scheduling algorithm is non-preemptive and prone to the 'convoy effect'?", "Round Robin", "First-Come, First-Served (FCFS)", "Shortest Remaining Time First", "Multilevel Feedback Queue", "B", "In FCFS, short processes get delayed behind a long CPU-burst process (the convoy effect)."));
            pool.add(new QuizQuestionDto(6, "What is the purpose of the Translation Lookaside Buffer (TLB)?", "Cache virtual-to-physical address translations", "Store active CPU registers", "Buffer disk writes", "Schedule threads", "A", "The TLB is a high-speed hardware cache on the CPU that stores recent virtual-to-physical page mappings."));
            pool.add(new QuizQuestionDto(7, "Which synchronization primitive consists of an integer value and two atomic operations, wait() and signal()?", "Mutex", "Semaphore", "Spinlock", "Condition Variable", "B", "A Semaphore was introduced by Dijkstra with atomic P (wait) and V (signal) operations on a counter."));
            pool.add(new QuizQuestionDto(8, "What does the Banker's Algorithm primarily do?", "Prevent deadlock by checking safe state before granting resources", "Detect deadlocks after they occur", "Schedule disk read heads", "Manage virtual memory swap space", "A", "Dijkstra's Banker's algorithm calculates resource allocation states to ensure deadlock avoidance."));
        } else if (normalizedSubject.contains("AI") || normalizedSubject.contains("ML") || normalizedSubject.contains("MACHINE LEARNING")) {
            pool.add(new QuizQuestionDto(1, "What does the vanishing gradient problem primarily affect in deep neural networks?", "Output layers", "Early hidden layers", "Activation functions like ReLU", "Dropout layers", "B", "During backpropagation, repeated chain-rule multiplication of small derivatives causes gradients in early layers to approach zero."));
            pool.add(new QuizQuestionDto(2, "Which activation function outputs values in the range (-1, 1)?", "Sigmoid", "ReLU", "Tanh", "Softmax", "C", "The Hyperbolic Tangent (Tanh) function maps real inputs to (-1, 1) and is zero-centered."));
            pool.add(new QuizQuestionDto(3, "What is the primary purpose of Dropout during neural network training?", "Speed up computation", "Prevent overfitting by randomly deactivating neurons", "Normalize input features", "Initialize weights dynamically", "B", "Dropout acts as regularizer by training an ensemble of thinned sub-networks to prevent co-adaptation."));
            pool.add(new QuizQuestionDto(4, "In Attention mechanisms (Transformer architecture), what are the three key matrices used in self-attention?", "Filter, Kernel, Stride", "Query, Key, Value (Q, K, V)", "Input, Hidden, Output", "Weights, Biases, Gradients", "B", "Scaled Dot-Product Attention calculates Softmax(Q * K^T / sqrt(d_k)) * V."));
            pool.add(new QuizQuestionDto(5, "Which metric is the harmonic mean of Precision and Recall?", "Accuracy", "F1 Score", "ROC-AUC", "Mean Squared Error", "B", "F1 Score is 2 * (Precision * Recall) / (Precision + Recall), balancing precision and recall."));
            pool.add(new QuizQuestionDto(6, "What type of learning algorithm is Q-Learning?", "Supervised Learning", "Reinforcement Learning", "Unsupervised Clustering", "Semi-supervised Learning", "B", "Q-Learning is a model-free, off-policy reinforcement learning algorithm to learn optimal action-value policies."));
            pool.add(new QuizQuestionDto(7, "Which optimizer combines momentum and adaptive learning rates (RMSProp)?", "SGD", "Adam", "Adagrad", "Nesterov", "B", "Adam (Adaptive Moment Estimation) computes adaptive rates using running estimates of first and second moments."));
        } else if (normalizedSubject.contains("SYSTEM") || normalizedSubject.contains("DESIGN")) {
            pool.add(new QuizQuestionDto(1, "According to the CAP theorem, which property must a distributed system sacrifice during a network partition?", "Consistency or Availability", "Latency or Throughput", "Scalability or Durability", "Fault tolerance or Performance", "A", "When a network partition (P) occurs, the system must choose between serving consistent data (C) or responding immediately (A)."));
            pool.add(new QuizQuestionDto(2, "What technique enables distributed caching and load distribution while minimizing key reshuffling when nodes join/leave?", "Round Robin", "Consistent Hashing", "Modulo Hashing", "Least Connections", "B", "Consistent Hashing maps both keys and nodes to a virtual hash ring, requiring only K/N keys to move on topology changes."));
            pool.add(new QuizQuestionDto(3, "What is the primary advantage of a Write-Through cache over Write-Back cache?", "Lower write latency", "Immediate consistency between cache and backing store", "Elimination of read misses", "Higher throughput under write-heavy loads", "B", "Write-Through simultaneously updates cache and database, ensuring zero data loss on cache node failure."));
            pool.add(new QuizQuestionDto(4, "Which component is best suited to absorb sudden spikes in incoming traffic in an asynchronous distributed architecture?", "Reverse Proxy", "Message Broker (e.g., Kafka / RabbitMQ)", "Relational Database Index", "CDN Edge", "B", "Message queues decouple producers from consumers, buffering spikes and preventing downstream service saturation."));
            pool.add(new QuizQuestionDto(5, "What database scaling pattern separates read operations from write operations across replicas?", "Sharding", "CQRS (Command Query Responsibility Segregation)", "Vertical Scaling", "Two-Phase Commit", "B", "CQRS separates read and update operations into different models and data stores for independent scaling."));
        } else if (normalizedSubject.contains("NETWORK") || normalizedSubject.contains("COMPUTER NETWORK")) {
            pool.add(new QuizQuestionDto(1, "Which OSI layer is responsible for end-to-end communication, segmentation, and flow control?", "Network Layer", "Transport Layer", "Data Link Layer", "Session Layer", "B", "The Transport Layer (TCP/UDP) handles end-to-end delivery, port multiplexing, and flow/error control."));
            pool.add(new QuizQuestionDto(2, "What is the size of an IPv6 address in bits?", "32 bits", "64 bits", "128 bits", "256 bits", "C", "IPv6 addresses are 128 bits (16 bytes) long, represented as 8 groups of 4 hexadecimal digits."));
            pool.add(new QuizQuestionDto(3, "In TCP's three-way handshake, what flags are sent in the second packet from server to client?", "SYN", "SYN + ACK", "ACK", "FIN + ACK", "B", "The server responds to the initial SYN packet with a SYN-ACK packet to synchronize sequence numbers."));
            pool.add(new QuizQuestionDto(4, "Which protocol translates an IP address into a physical MAC address on a local area network?", "DHCP", "ARP (Address Resolution Protocol)", "DNS", "NAT", "B", "ARP broadcasts a query on the local subnet to resolve target IP addresses to hardware MAC addresses."));
            pool.add(new QuizQuestionDto(5, "What is the default port number used by HTTPS traffic?", "80", "443", "8080", "22", "B", "Standard HTTP uses port 80, whereas TLS/SSL secured HTTPS operates over TCP port 443."));
        } else if (normalizedSubject.contains("DBMS") || normalizedSubject.contains("DATABASE")) {
            pool.add(new QuizQuestionDto(1, "What does the ACID acronym stand for in database transaction management?", "Atomicity, Consistency, Isolation, Durability", "Authentication, Concurrency, Integrity, Distribution", "Access, Control, Indexing, Decoupling", "Availability, Cache, Idempotency, Durability", "A", "ACID guarantees that database transactions are processed reliably and maintain integrity."));
            pool.add(new QuizQuestionDto(2, "Which normal form requires the elimination of transitive functional dependencies?", "First Normal Form (1NF)", "Second Normal Form (2NF)", "Third Normal Form (3NF)", "Boyce-Codd Normal Form (BCNF)", "C", "3NF requires the relation to be in 2NF and that no non-prime attribute transitively depends on the primary key."));
            pool.add(new QuizQuestionDto(3, "What data structure is standard for indexing in relational databases like MySQL InnoDB?", "Hash Table", "B+ Tree", "Binary Search Tree", "Skip List", "B", "B+ Trees keep data sorted with all records at leaf nodes linked sequentially, optimizing range queries and disk block reads."));
            pool.add(new QuizQuestionDto(4, "In SQL, which clause is used to filter groups created by the GROUP BY statement?", "WHERE", "HAVING", "ORDER BY", "FILTER", "B", "The HAVING clause applies filtering conditions to aggregate group rows, whereas WHERE filters individual rows."));
            pool.add(new QuizQuestionDto(5, "Which isolation level prevents Dirty Reads and Non-Repeatable Reads, but allows Phantom Reads?", "Read Uncommitted", "Read Committed", "Repeatable Read", "Serializable", "C", "Repeatable Read guarantees rows read cannot change during transaction, but concurrent inserts can cause phantom rows."));
        } else {
            // Computer Architecture & general CS
            pool.add(new QuizQuestionDto(1, "What does Amdahl's Law calculate?", "Maximum theoretical speedup of a system when only a portion is improved/parallelized", "Cache miss penalty", "Clock frequency limits", "Instruction pipeline depth", "A", "Amdahl's Law states speedup is constrained by the sequential portion of the workload: S = 1 / ((1 - p) + p/s)."));
            pool.add(new QuizQuestionDto(2, "Which hazard in pipelined processors occurs when instructions depend on the result of a previous instruction still in the pipeline?", "Structural Hazard", "Data Hazard", "Control Hazard", "Branch Hazard", "B", "Data hazards (RAW, WAR, WAW) occur when operand data is needed before it has been written back to registers."));
            pool.add(new QuizQuestionDto(3, "What is the role of the Program Counter (PC) register in a CPU?", "Store the result of ALU operations", "Hold the memory address of the next instruction to be fetched", "Count execution cycles", "Track stack overflow", "B", "The Program Counter points to the memory location of the next machine instruction to execute."));
            pool.add(new QuizQuestionDto(4, "Which cache mapping technique allows a memory block to be placed in any cache line?", "Direct Mapped", "Fully Associative", "Set Associative", "Sector Mapped", "B", "In fully associative caching, any memory block can reside in any cache block, minimizing conflict misses."));
            pool.add(new QuizQuestionDto(5, "What is branch prediction used for in modern superscalar processors?", "Reduce pipeline stalls by guessing the outcome of conditional branch instructions", "Allocate RAM", "Detect hardware errors", "Optimize clock gating", "A", "Branch prediction anticipates control flow to keep instruction fetch and decode stages filled."));
        }

        // Shuffle and pick required count (or duplicate with slight variations if more required)
        Collections.shuffle(pool);
        List<QuizQuestionDto> result = new ArrayList<>();
        int id = 1;
        while (result.size() < count) {
            for (QuizQuestionDto q : pool) {
                if (result.size() >= count) break;
                QuizQuestionDto copy = new QuizQuestionDto(
                        id++,
                        q.getQuestion(),
                        q.getOptionA(),
                        q.getOptionB(),
                        q.getOptionC(),
                        q.getOptionD(),
                        q.getCorrectAnswer(),
                        q.getExplanation()
                );
                result.add(copy);
            }
        }
        return result;
    }
}
