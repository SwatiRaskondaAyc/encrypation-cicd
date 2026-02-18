package com.example.prog.config;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;


@Configuration

public class CorsConfig {

    @Value("${frontend.url}")
    private String frontendUrl;

	@Value("${frontend.urll}")
    private String frontendUrll;

	@Value("${alternate.frontend.url}")
	private String alternateFrontendUrl;

	public String getFrontendUrl() {
		return frontendUrl;
	}

	public void setFrontendUrl(String frontendUrl) {
		this.frontendUrl = frontendUrl;
	}

		public String getFrontendUrll() {
		return frontendUrll;
	}

	public void setFrontendUrll(String frontendUrll) {
		this.frontendUrll = frontendUrll;
	}

	public String getAlternateFrontendUrl() {
		return alternateFrontendUrl;
	}

	public void setAlternateFrontendUrl(String alternateFrontendUrl) {
		this.alternateFrontendUrl = alternateFrontendUrl;
	}
}


