/**
 * PDF Component Registry
 * 
 * A modular system for PDF generation where components can be easily added/removed.
 * Simply register your component and it will be included in the PDF export.
 * 
 * Usage:
 * 1. Import the registry in your component
 * 2. Register your component with: registerPDFComponent('MyComponent', {...options})
 * 3. The component will automatically be included in PDF exports
 */

import * as htmlToImage from "html-to-image";
import jsPDF from "jspdf";

// Component Registry - Add your components here!
const PDF_COMPONENTS = [
    {
        id: 'summary-cards',
        name: 'Summary Cards',
        selector: '[data-pdf-section="summary-cards"]',
        order: 1,
        pageBreakBefore: false,
        description: 'Portfolio summary metrics including capital, P&L, returns'
    },
    {
        id: 'performers',
        name: 'Best/Worst Performers',
        selector: '[data-pdf-section="performers"]',
        order: 2,
        pageBreakBefore: false,
        description: 'Best and worst performing stocks'
    },
    {
        id: 'alpha-card',
        name: 'Alpha Analysis',
        selector: '[data-pdf-section="alpha-card"]',
        order: 3,
        pageBreakBefore: true,
        description: "Jensen's Alpha metrics"
    },
    {
        id: 'beta-card',
        name: 'Beta Analysis',
        selector: '[data-pdf-section="beta-card"]',
        order: 4,
        pageBreakBefore: false,
        description: 'Portfolio beta and market sensitivity'
    },
    {
        id: 'metrics-card',
        name: 'Risk Metrics',
        selector: '[data-pdf-section="metrics-card"]',
        order: 5,
        pageBreakBefore: false,
        description: 'Sharpe, Sortino, and other risk metrics'
    },
    {
        id: 'valuation-pe',
        name: 'P/E Ratio',
        selector: '[data-pdf-section="valuation-pe"]',
        order: 6,
        pageBreakBefore: true,
        description: 'Price-to-Earnings ratio card'
    },
    {
        id: 'valuation-pb',
        name: 'P/B Ratio',
        selector: '[data-pdf-section="valuation-pb"]',
        order: 7,
        pageBreakBefore: false,
        description: 'Price-to-Book ratio card'
    },
    {
        id: 'valuation-yield',
        name: 'Dividend Yield',
        selector: '[data-pdf-section="valuation-yield"]',
        order: 8,
        pageBreakBefore: false,
        description: 'Dividend yield card'
    },
    {
        id: 'graph-catalog',
        name: 'Visual Performance Catalog',
        selector: '[data-pdf-section="graph-catalog"]',
        order: 9,
        pageBreakBefore: true,
        description: 'All charts and graphs'
    },
    {
        id: 'transactions',
        name: 'Transaction Sheet',
        selector: '[data-pdf-section="transactions"]',
        order: 10,
        pageBreakBefore: true,
        description: 'Holdings and transaction history'
    },
];

// Runtime registry for dynamic additions
let dynamicComponents = [];

/**
 * Register a new component for PDF export
 * @param {Object} config - Component configuration
 * @param {string} config.id - Unique identifier
 * @param {string} config.name - Display name
 * @param {string} config.selector - CSS selector to find the element
 * @param {number} config.order - Order in PDF (lower = earlier)
 * @param {boolean} config.pageBreakBefore - Start on new page
 * @param {string} config.description - Description for logs
 */
export const registerPDFComponent = (config) => {
    const existing = dynamicComponents.findIndex(c => c.id === config.id);
    if (existing >= 0) {
        dynamicComponents[existing] = config;
    } else {
        dynamicComponents.push(config);
    }
    console.log(`[PDF Registry] Registered component: ${config.name}`);
};

/**
 * Unregister a component from PDF export
 * @param {string} id - Component ID to remove
 */
export const unregisterPDFComponent = (id) => {
    dynamicComponents = dynamicComponents.filter(c => c.id !== id);
    console.log(`[PDF Registry] Unregistered component: ${id}`);
};

/**
 * Get all registered components sorted by order
 */
export const getRegisteredComponents = () => {
    return [...PDF_COMPONENTS, ...dynamicComponents].sort((a, b) => a.order - b.order);
};

/**
 * Clear all dynamic components
 */
export const clearDynamicComponents = () => {
    dynamicComponents = [];
};

/**
 * Main PDF Export Function using Component Registry
 */
export const exportToPDFWithRegistry = async ({
    containerRef,
    data,
    onProgress,
    includeComponents = null, // Array of component IDs to include, null = all
    excludeComponents = []    // Array of component IDs to exclude
}) => {
    if (!containerRef?.current) {
        throw new Error("Container ref is required for PDF export");
    }

    const container = containerRef.current;
    const allComponents = getRegisteredComponents();

    // Filter components
    let componentsToExport = allComponents.filter(comp => {
        if (excludeComponents.includes(comp.id)) return false;
        if (includeComponents !== null && !includeComponents.includes(comp.id)) return false;
        return true;
    });

    console.log('[PDF Export] Components to export:', componentsToExport.map(c => c.name));

    // Initialize PDF - Legal size for better content fit
    const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [215.9, 355.6], // Legal
        compress: true,
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 15;
    const contentWidth = pageWidth - (2 * margin);
    const headerHeight = 20;
    const footerHeight = 15;
    const maxContentHeight = pageHeight - (2 * margin) - headerHeight - footerHeight;

    let currentY = margin + headerHeight;
    let pageNum = 1;

    // Helper functions
    const addHeader = () => {
        pdf.setFillColor(71, 85, 105);
        pdf.rect(0, 0, pageWidth, headerHeight, 'F');
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(18);
        pdf.setFont('helvetica', 'bold');
        pdf.text('CMDA Hub | Portfolio Report', margin, 12);
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'normal');
        const date = new Date().toLocaleDateString('en-IN', {
            day: '2-digit', month: 'short', year: 'numeric'
        });
        pdf.text(date, pageWidth - margin, 12, { align: 'right' });

        // Watermark
        pdf.saveGraphicsState();
        pdf.setGState(new pdf.GState({ opacity: 0.05 }));
        pdf.setTextColor(100, 116, 139);
        pdf.setFontSize(90);
        pdf.setFont('helvetica', 'bold');
        pdf.text('CMDA HUB', pageWidth / 2, pageHeight / 2, { align: 'center', angle: 45 });
        pdf.restoreGraphicsState();
    };

    const addFooter = (current, total) => {
        const footerY = pageHeight - 8;
        pdf.setFillColor(248, 250, 252);
        pdf.rect(0, pageHeight - footerHeight, pageWidth, footerHeight, 'F');
        pdf.setTextColor(100, 116, 139);
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'italic');
        pdf.text('CMDA Confidential - For informational purposes only', margin, footerY);
        pdf.setFont('helvetica', 'bold');
        pdf.text(`Page ${current} of ${total}`, pageWidth - margin, footerY, { align: 'right' });
    };

    const startNewPage = () => {
        pdf.addPage();
        pageNum++;
        currentY = margin + headerHeight;
        addHeader();
    };

    const captureElement = async (element) => {
        if (!element) return null;
        try {
            // Force light mode for PDF capture
            element.classList.add('pdf-capture-mode');

            const dataUrl = await htmlToImage.toPng(element, {
                quality: 1.0,
                pixelRatio: 3,
                backgroundColor: '#ffffff',
                skipFonts: true,
                filter: (node) => {
                    if (node.tagName === 'LINK' && node.rel === 'stylesheet') return false;
                    if (node.tagName === 'SCRIPT') return false;
                    if (node.classList?.contains('no-pdf')) return false;
                    return true;
                },
            });

            element.classList.remove('pdf-capture-mode');
            return dataUrl;
        } catch (error) {
            console.warn('Capture failed for element:', error);
            return null;
        }
    };

    const addImageToPDF = async (dataUrl, forceNewPage = false) => {
        if (!dataUrl) return;

        const img = new Image();
        img.src = dataUrl;
        await new Promise(resolve => { img.onload = resolve; });

        const imgAspectRatio = img.width / img.height;
        let renderWidth = contentWidth;
        let renderHeight = renderWidth / imgAspectRatio;

        // Handle large images that need multiple pages
        if (renderHeight > maxContentHeight) {
            const pagesNeeded = Math.ceil(renderHeight / maxContentHeight);

            for (let i = 0; i < pagesNeeded; i++) {
                if (i > 0 || forceNewPage || currentY > margin + headerHeight + 10) {
                    startNewPage();
                }

                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                const sourceY = (i * maxContentHeight / renderHeight) * img.height;
                const sourceHeight = Math.min(
                    (maxContentHeight / renderHeight) * img.height,
                    img.height - sourceY
                );

                canvas.width = img.width;
                canvas.height = sourceHeight;

                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, sourceY, img.width, sourceHeight, 0, 0, img.width, sourceHeight);

                const sliceDataUrl = canvas.toDataURL('image/png', 1.0);
                const sliceHeight = Math.min(maxContentHeight, renderHeight - (i * maxContentHeight));

                pdf.addImage(sliceDataUrl, 'PNG', margin, currentY, renderWidth, sliceHeight, undefined, 'FAST');
            }
            currentY = margin + headerHeight;
        } else {
            // Check if we need a new page
            if (forceNewPage || currentY + renderHeight > pageHeight - margin - footerHeight) {
                startNewPage();
            }

            pdf.addImage(dataUrl, 'PNG', margin, currentY, renderWidth, renderHeight, undefined, 'FAST');
            currentY += renderHeight + 8;
        }
    };

    // Start PDF generation
    addHeader();

    // Title
    pdf.setFontSize(22);
    pdf.setTextColor(30, 41, 59);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Portfolio Analysis Report', margin, currentY);
    currentY += 15;

    // Process each component
    const totalComponents = componentsToExport.length;

    for (let i = 0; i < totalComponents; i++) {
        const comp = componentsToExport[i];
        const progressPercent = Math.round(20 + (70 * (i / totalComponents)));

        if (onProgress) {
            onProgress(`Capturing ${comp.name}...`, progressPercent);
        }

        console.log(`[PDF Export] Processing: ${comp.name} (${comp.selector})`);

        // Find all elements matching the selector
        const elements = container.querySelectorAll(comp.selector);

        if (elements.length === 0) {
            console.warn(`[PDF Export] No elements found for: ${comp.name} (${comp.selector})`);
            continue;
        }

        for (const element of elements) {
            // Wait longer for charts to render (especially Plotly)
            await new Promise(resolve => setTimeout(resolve, 500));

            // Capture and add to PDF
            const dataUrl = await captureElement(element);

            if (dataUrl) {
                await addImageToPDF(dataUrl, comp.pageBreakBefore);
                console.log(`[PDF Export] ✓ Added element from: ${comp.name}`);
            }
        }
    }

    // Add footers to all pages
    if (onProgress) onProgress("Finalizing PDF...", 95);

    const totalPages = pdf.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        addFooter(i, totalPages);
    }

    // Save
    const fileName = `Portfolio_Report_${new Date().toLocaleDateString('en-GB').replace(/\//g, '_')}.pdf`;
    pdf.save(fileName);

    return { success: true, pages: totalPages, fileName };
};

/**
 * Quick export function - exports all registered components
 */
export const quickExportPDF = async (containerRef, data, onProgress) => {
    return exportToPDFWithRegistry({ containerRef, data, onProgress });
};

/**
 * Custom export - specify which components to include
 */
export const customExportPDF = async (containerRef, data, componentIds, onProgress) => {
    return exportToPDFWithRegistry({
        containerRef,
        data,
        onProgress,
        includeComponents: componentIds
    });
};

export default {
    registerPDFComponent,
    unregisterPDFComponent,
    getRegisteredComponents,
    exportToPDFWithRegistry,
    quickExportPDF,
    customExportPDF
};
