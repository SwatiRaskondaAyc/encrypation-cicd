// CMDAHub Tracking Utility
// Unified tracking for Meta Pixel & Google Tag Manager

/**
 * Initialize tracking system
 */
export const initTracking = () => {
    if (typeof window !== 'undefined') {
        // Initialize dataLayer if not exists
        window.dataLayer = window.dataLayer || [];

        // Initialize Facebook Pixel if not loaded
        if (!window.fbq) {
            window.fbq = function () {
                window.fbq.callMethod ?
                    window.fbq.callMethod.apply(window.fbq, arguments) :
                    window.fbq.queue.push(arguments);
            };
            if (!window._fbq) window._fbq = window.fbq;
            window.fbq.push = window.fbq;
            window.fbq.loaded = true;
            window.fbq.version = '2.0';
            window.fbq.queue = [];
        }

        console.log('📊 CMDAHub Tracking System Initialized');
        console.log('Pixel ID: 1212004467278399');
        console.log('GTM ID: GTM-NFZ6T2JG');
    }
};

/**
 * Track page view (for React Router SPA)
 * @param {string} pagePath - Current page path
 * @param {string} pageTitle - Page title
 */
export const trackPageView = (pagePath, pageTitle = document.title) => {
    // Meta Pixel PageView
    if (window.fbq) {
        window.fbq('track', 'PageView');
        console.log(`🔍 Meta Pixel: PageView - ${pagePath}`);
    }

    // GTM dataLayer push
    if (window.dataLayer) {
        window.dataLayer.push({
            event: 'page_view',
            page_path: pagePath,
            page_title: pageTitle,
            timestamp: new Date().toISOString(),
            user_agent: navigator.userAgent,
            language: navigator.language
        });
        console.log(`📈 GTM: page_view - ${pagePath}`);
    }
};

/**
 * Track user registration/signup
 */
export const trackSignup = (source = 'unknown', userType = 'individual') => {
    if (window.fbq) {
        window.fbq('track', 'InitiateCheckout', {
            button_location: source,
            user_type: userType
        });
        console.log(`🔍 Meta Pixel: InitiateCheckout - ${source}`);
    }

    if (window.dataLayer) {
        window.dataLayer.push({
            event: 'signup_initiated',
            source: source,
            user_type: userType,
            timestamp: new Date().toISOString()
        });
        console.log(`📈 GTM: signup_initiated - ${source}`);
    }
};

/**
 * Track completed registration
 */
export const trackRegistrationComplete = (method = 'email', userType = 'individual', promoUsed = false) => {
    if (window.fbq) {
        window.fbq('track', 'CompleteRegistration', {
            registration_method: method,
            user_type: userType,
            promo_used: promoUsed
        });
        console.log(`🔍 Meta Pixel: CompleteRegistration - ${method}`);
    }

    if (window.dataLayer) {
        window.dataLayer.push({
            event: 'registration_complete',
            method: method,
            user_type: userType,
            promo_used: promoUsed,
            timestamp: new Date().toISOString()
        });
        console.log(`📈 GTM: registration_complete - ${method}`);
    }
};

/**
 * Track login
 */
export const trackLogin = (method = 'email') => {
    if (window.fbq) {
        window.fbq('track', 'Login', { method: method });
        console.log(`🔍 Meta Pixel: Login - ${method}`);
    }

    if (window.dataLayer) {
        window.dataLayer.push({
            event: 'login_success',
            method: method,
            timestamp: new Date().toISOString()
        });
        console.log(`📈 GTM: login_success - ${method}`);
    }
};

/**
 * Track tool/page view
 */
export const trackToolView = (toolName, category, extraParams = {}) => {
    if (window.fbq) {
        window.fbq('track', 'ViewContent', {
            content_name: toolName,
            content_category: category,
            ...extraParams
        });
        console.log(`🔍 Meta Pixel: ViewContent - ${toolName}`);
    }

    if (window.dataLayer) {
        window.dataLayer.push({
            event: 'tool_view',
            tool_name: toolName,
            category: category,
            ...extraParams,
            timestamp: new Date().toISOString()
        });
        console.log(`📈 GTM: tool_view - ${toolName}`);
    }
};

/**
 * Generic event tracker for custom actions
 * @param {string} actionName - Name of the action (GTM event name)
 * @param {string} category - Category (Meta Pixel content_category)
 * @param {Object} params - Additional parameters
 */
export const trackAction = (actionName, category, params = {}) => {
    // Meta Pixel Custom Event
    if (window.fbq) {
        window.fbq('trackCustom', actionName, {
            content_category: category,
            ...params
        });
        console.log(`🔍 Meta Pixel: trackCustom - ${actionName}`);
    }

    // GTM dataLayer push
    if (window.dataLayer) {
        window.dataLayer.push({
            event: actionName,
            category: category,
            ...params,
            timestamp: new Date().toISOString()
        });
        console.log(`📈 GTM: ${actionName}`);
    }
};

/**
 * Track lead generation
 */
export const trackLead = (formType = 'contact', formData = {}) => {
    if (window.fbq) {
        window.fbq('track', 'Lead', {
            form_type: formType,
            ...formData
        });
        console.log(`🔍 Meta Pixel: Lead - ${formType}`);
    }

    if (window.dataLayer) {
        window.dataLayer.push({
            event: 'lead_submitted',
            form_type: formType,
            ...formData,
            timestamp: new Date().toISOString()
        });
        console.log(`📈 GTM: lead_submitted - ${formType}`);
    }
};

/**
 * Track purchase/upgrade
 */
export const trackPurchase = (value, currency = 'INR', plan = 'basic', orderId = '') => {
    if (window.fbq) {
        window.fbq('track', 'Purchase', {
            value: value,
            currency: currency,
            content_name: plan,
            transaction_id: orderId
        });
        console.log(`🔍 Meta Pixel: Purchase - ${plan} (${value} ${currency})`);
    }

    if (window.dataLayer) {
        window.dataLayer.push({
            event: 'purchase_complete',
            value: value,
            currency: currency,
            plan: plan,
            order_id: orderId,
            timestamp: new Date().toISOString()
        });
        console.log(`📈 GTM: purchase_complete - ${plan}`);
    }
};

/**
 * Track add to cart
 */
export const trackAddToCart = (plan, value) => {
    if (window.fbq) {
        window.fbq('track', 'AddToCart', {
            content_name: plan,
            value: value,
            currency: 'INR'
        });
        console.log(`🔍 Meta Pixel: AddToCart - ${plan}`);
    }

    if (window.dataLayer) {
        window.dataLayer.push({
            event: 'add_to_cart',
            plan: plan,
            value: value,
            timestamp: new Date().toISOString()
        });
        console.log(`📈 GTM: add_to_cart - ${plan}`);
    }
};

/**
 * Simplified Tool Tracking Helper
 */
export const trackCMDAHubTools = {
    brokerageCalculator: {
        view: () => trackToolView('Brokerage Calculator', 'Trading Tools', { tool_type: 'calculator' }),
        calculate: (data) => {
            trackAction('brokerage_calculation', 'Trading Tools', data);
        },
        compare: (brokersCount) => {
            trackAction('brokerage_comparison', 'Trading Tools', { brokers_count: brokersCount });
        }
    },
    paperTrading: {
        view: () => trackToolView('Paper Trading', 'Trading Tools', { tool_type: 'simulator' }),
        startSimulation: (corpus) => {
            trackAction('simulation_started', 'Trading Tools', { starting_corpus: corpus });
        }
    },
    equityHub: {
        view: () => {
            trackToolView('Equity Insights', 'Market Data', { tool_type: 'dashboard' });
            trackAction('equity_insights_loaded', 'Market Data');
        },
        search: (query, resultsCount) => {
            trackAction('equity_search', 'Market Data', { query: query, results_count: resultsCount });
        },
        select: (symbol, name) => {
            trackAction('equity_select', 'Market Data', { symbol, name });
        }
    },
    patterns: {
        view: () => {
            trackToolView('Candle Pattern Detection', 'Technical Analysis', { tool_type: 'analysis' });
            trackAction('patterns_loaded', 'Technical Analysis');
        },
        detect: (patternTypes) => {
            trackAction('pattern_detected', 'Technical Analysis', {
                pattern_type: Array.isArray(patternTypes) ? patternTypes.join(', ') : patternTypes
            });
        },
        researchView: (symbol) => {
            trackAction('patterns_research_view', 'Technical Analysis', { symbol });
        }
    },
    portfolio: {
        view: () => {
            trackToolView('Portfolio Management', 'Portfolio Tools', { tool_type: 'portfolio' });
            trackAction('portfolio_view', 'Portfolio Tools');
        },
        addStock: (symbol, quantity) => {
            trackAction('portfolio_add_stock', 'Portfolio Tools', { symbol, quantity });
        },
        deleteStock: (symbol) => {
            trackAction('portfolio_delete_stock', 'Portfolio Tools', { symbol });
        }
    },
    dashboard: {
        view: () => {
            trackToolView('User Dashboard', 'Dashboard', { tool_type: 'custom_layout' });
            trackAction('dashboard_view', 'Dashboard');
        },
        save: (name, plotsCount) => {
            trackAction('dashboard_save', 'Dashboard', { dashboard_name: name, plots_count: plotsCount });
        },
        delete: (name) => {
            trackAction('dashboard_delete', 'Dashboard', { dashboard_name: name });
        },
        tabSwitch: (tabName) => {
            trackAction('dashboard_tab_switch', 'Dashboard', { tab: tabName });
        }
    },
    webinar: {
        viewList: () => {
            trackToolView('Webinars', 'Educational Content', { tool_type: 'webinar_list' });
            trackAction('webinar_list_view', 'Educational Content');
        },
        viewDetails: (webinarId, title) => {
            trackToolView(`Webinar: ${title}`, 'Educational Content', { tool_type: 'webinar_detail', webinar_id: webinarId });
            trackAction('webinar_detail_view', 'Educational Content', { webinar_id: webinarId, title });
        },
        enroll: (webinarId, title, source) => {
            trackAction('webinar_enroll_click', 'Educational Content', { webinar_id: webinarId, title, source });
        },
        join: (webinarId, title, link) => {
            trackAction('webinar_join_click', 'Educational Content', { webinar_id: webinarId, title, link });
        }
    }
};

/**
 * Track chatbot interactions
 */
export const trackChatbot = {
    open: (source = 'floating_button') => {
        if (window.dataLayer) {
            window.dataLayer.push({
                event: 'chatbot_opened',
                source: source,
                timestamp: new Date().toISOString()
            });
        }
    },
    close: () => {
        if (window.dataLayer) {
            window.dataLayer.push({
                event: 'chatbot_closed',
                timestamp: new Date().toISOString()
            });
        }
    }
};

/**
 * Setup button tracking
 */
export const setupButtonTracking = () => {
    if (typeof window === 'undefined') return;

    document.addEventListener('click', (event) => {
        const button = event.target.closest('[data-track]');

        if (button) {
            const eventName = button.getAttribute('data-track');
            const paramsAttr = button.getAttribute('data-track-params');
            const params = paramsAttr ? JSON.parse(paramsAttr) : {};

            if (window.dataLayer) {
                window.dataLayer.push({
                    event: eventName,
                    ...params,
                    element_text: button.textContent?.trim() || '',
                    timestamp: new Date().toISOString()
                });
            }
        }
    });
};

/**
 * Get tracking status
 */
export const getTrackingStatus = () => {
    if (typeof window === 'undefined') return {};
    return {
        dataLayer: !!window.dataLayer,
        facebookPixel: !!window.fbq,
        pixelId: '1212004467278399',
        gtmId: 'GTM-NFZ6T2JG',
        timestamp: new Date().toISOString()
    };
};

/**
 * Test tracking
 */
export const testTracking = () => {
    console.log('🧪 Testing Tracking...');
    if (window.dataLayer) console.log('✅ dataLayer exists');
    if (window.fbq) console.log('✅ Facebook Pixel loaded');
};

// Auto-initialize
if (typeof window !== 'undefined') {
    initTracking();
    setupButtonTracking();
}