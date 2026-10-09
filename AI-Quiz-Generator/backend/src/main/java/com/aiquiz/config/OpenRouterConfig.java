package com.aiquiz.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenRouterConfig {

    @Value("${app.openrouter.api-key:}")
    private String apiKey;

    @Value("${app.openrouter.base-url:https://openrouter.ai/api/v1}")
    private String baseUrl;

    @Value("${app.openrouter.model:google/gemini-2.0-flash-001}")
    private String model;

    @Value("${app.openrouter.site-url:http://localhost:5173}")
    private String siteUrl;

    @Value("${app.openrouter.site-name:AI Quiz Generator}")
    private String siteName;

    public String getApiKey() { return apiKey; }
    public String getBaseUrl() { return baseUrl; }
    public String getModel() { return model; }
    public String getSiteUrl() { return siteUrl; }
    public String getSiteName() { return siteName; }
}
