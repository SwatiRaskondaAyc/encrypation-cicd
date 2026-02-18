import * as htmlToImage from "html-to-image";
import jsPDF from "jspdf";

/**
 * PDF Section Titles - Used for Table of Contents and Headers
 */
const PDF_SECTIONS = {
    COVER: { title: "Portfolio Analysis", page: 1 },
    TOC: { title: "Table of Contents", page: 2 },
    HOLDINGS: { title: "1. Current Holdings Overview", page: 3 },
    SUMMARY: { title: "2. Portfolio Performance Summary", page: 4 },
    ALPHA: { title: "3. Alpha Metrics Analysis", page: 5 },
    BETA: { title: "4. Beta Metrics & Risk Assessment", page: 6 },
    METRICS: { title: "5. Valuation Ratios & Metrics", page: 7 },
    GRAPHS: { title: "6. Visual Performance Catalog", page: 8 },
    GLOSSARY: { title: "7. Glossary & Detailed Analysis", page: 9 },
};

/**
 * Export Portfolio Dashboard to PDF
 * @param {Object} options - Export options
 * @param {HTMLElement} options.element - DOM element to capture
 * @param {Object} options.data - Portfolio data for modal details
 * @param {Function} options.onProgress - Progress callback
 * @param {string} options.portfolioName - Name of the portfolio
 * @param {string} options.companyLogo - Base64 or URL of company logo
 * @returns {Promise<void>}
 */
export const exportPortfolioToPDF = async ({ element, data, onProgress, portfolioName, companyLogo = "/cmda_logo1.png" }) => {
    if (!element) {
        throw new Error("Element is required for PDF export");
    }

    try {
        // Legal Portrait: 8.5 x 14 inches for more vertical room
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: [215.9, 355.6],
            compress: true,
        });

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const margin = 10;
        const contentWidth = pageWidth - (2 * margin);
        const headerHeight = 18;
        const footerHeight = 12;
        const maxContentHeight = pageHeight - (2 * margin) - headerHeight - footerHeight;

        // ============================================
        // COVER PAGE
        // ============================================
        const addCoverPage = async () => {
            // White background
            pdf.setFillColor(255, 255, 255);
            pdf.rect(0, 0, pageWidth, pageHeight, 'F');

            // Subtle decorative accent (light gray or very light blue)
            pdf.setFillColor(248, 250, 252); // Slate-50
            pdf.circle(pageWidth * 0.8, pageHeight * 0.2, 80, 'F');
            pdf.setFillColor(241, 245, 249); // Slate-100
            pdf.circle(pageWidth * 0.2, pageHeight * 0.8, 60, 'F');

            // Corner Logos
            try {
                // Left Logo (aYc Analytics)
                const leftLogo = "/ayclogo2.png";
                pdf.addImage(leftLogo, 'PNG', 15, 15, 35, 35);

                // Right Logo (CMDA HUB)
                const rightLogo = "/CMDALOGO.png";
                pdf.addImage(rightLogo, 'PNG', pageWidth - 50, 15, 35, 35);
            } catch (e) {
                console.warn('Could not add corner logos to PDF:', e);
            }

            // Main Title: "PORTFOLIO ANALYSIS"
            const titleY = 120;
            pdf.setTextColor(30, 41, 59); // Slate-800
            pdf.setFontSize(54);
            pdf.setFont('helvetica', 'bold');
            pdf.text('PORTFOLIO', pageWidth / 2, titleY, { align: 'center' });
            pdf.text('ANALYSIS', pageWidth / 2, titleY + 20, { align: 'center' });

            // Accent line under title
            pdf.setDrawColor(37, 99, 235); // Blue-600
            pdf.setLineWidth(2);
            pdf.line(pageWidth / 2 - 50, titleY + 30, pageWidth / 2 + 50, titleY + 30);

            // Portfolio Name Box
            const boxY = titleY + 60;
            const boxHeight = 60;
            pdf.setFillColor(241, 245, 249); // Slate-100
            pdf.roundedRect(margin + 20, boxY, contentWidth - 40, boxHeight, 5, 5, 'F');

            // Portfolio Name Label
            pdf.setTextColor(71, 85, 105); // Slate-600
            pdf.setFontSize(14);
            pdf.setFont('helvetica', 'normal');
            pdf.text('PORTFOLIO NAME', pageWidth / 2, boxY + 20, { align: 'center' });

            // Portfolio Name Value
            pdf.setTextColor(30, 41, 59); // Slate-800
            pdf.setFontSize(32);
            pdf.setFont('helvetica', 'bold');
            pdf.text(portfolioName || "My Portfolio", pageWidth / 2, boxY + 45, { align: 'center' });

            // Generated Date
            const dateY = boxY + boxHeight + 40;
            pdf.setTextColor(148, 163, 184);
            pdf.setFontSize(12);
            pdf.setFont('helvetica', 'normal');
            const dateStr = new Date().toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
            pdf.text(`Generated on ${dateStr}`, pageWidth / 2, dateY, { align: 'center' });

            // Footer notice
            pdf.setTextColor(100, 116, 139);
            pdf.setFontSize(10);
            pdf.text('Comprehensive Analysis Report • Confidential • Powered by CMDA HUB', pageWidth / 2, pageHeight - 30, { align: 'center' });
        };

        // ============================================
        // TABLE OF CONTENTS PAGE
        // ============================================
        const addTableOfContents = () => {
            pdf.addPage();

            // Header
            pdf.setFillColor(30, 41, 59);
            pdf.rect(0, 0, pageWidth, headerHeight, 'F');
            pdf.setTextColor(255, 255, 255);
            pdf.setFontSize(14);
            pdf.setFont('helvetica', 'bold');
            pdf.text('Table of Contents', margin, 11);

            // Content area
            let yPos = 50;

            // Title
            pdf.setTextColor(15, 23, 42);
            pdf.setFontSize(28);
            pdf.setFont('helvetica', 'bold');
            pdf.text('Table of Contents', margin, yPos);

            // Accent line
            pdf.setDrawColor(59, 130, 246);
            pdf.setLineWidth(1.5);
            pdf.line(margin, yPos + 5, margin + 60, yPos + 5);

            yPos += 30;

            // TOC Entries
            const tocEntries = [
                { num: "1", title: "Current Holdings Overview", desc: "Complete list of your portfolio holdings" },
                { num: "2", title: "Portfolio Performance Summary", desc: "Key performance metrics and returns" },
                { num: "3", title: "Alpha Metrics Analysis", desc: "Excess returns over benchmark" },
                { num: "4", title: "Beta Metrics & Risk Assessment", desc: "Market volatility and risk measures" },
                { num: "5", title: "Valuation Ratios & Metrics", desc: "P/E, P/B, and dividend yield analysis" },
                { num: "6", title: "Visual Performance Catalog", desc: "Graphical representation of portfolio" },
                { num: "7", title: "Glossary & Detailed Analysis", desc: "Metric definitions and formulas" },
            ];

            tocEntries.forEach((entry, idx) => {
                // Section number circle
                pdf.setFillColor(59, 130, 246);
                pdf.circle(margin + 8, yPos - 3, 8, 'F');
                pdf.setTextColor(255, 255, 255);
                pdf.setFontSize(12);
                pdf.setFont('helvetica', 'bold');
                pdf.text(entry.num, margin + 8, yPos, { align: 'center' });

                // Section title
                pdf.setTextColor(15, 23, 42);
                pdf.setFontSize(14);
                pdf.setFont('helvetica', 'bold');
                pdf.text(entry.title, margin + 22, yPos);

                // Description
                pdf.setTextColor(100, 116, 139);
                pdf.setFontSize(10);
                pdf.setFont('helvetica', 'normal');
                pdf.text(entry.desc, margin + 22, yPos + 8);

                // Dotted line to page number
                pdf.setDrawColor(200, 200, 200);
                pdf.setLineDashPattern([1, 2], 0);
                const textWidth = pdf.getTextWidth(entry.title);
                pdf.line(margin + 22 + textWidth + 5, yPos - 2, pageWidth - margin - 25, yPos - 2);
                pdf.setLineDashPattern([], 0);

                // Page number
                pdf.setTextColor(59, 130, 246);
                pdf.setFontSize(12);
                pdf.setFont('helvetica', 'bold');
                pdf.text(`${idx + 3}`, pageWidth - margin - 10, yPos, { align: 'right' });

                yPos += 28;
            });
        };

        let currentY = margin + headerHeight;
        let totalSections = 0;
        let sectionsProcessed = 0;

        // Helper: Add header with section title
        const addHeader = (sectionTitle = '') => {
            pdf.setFillColor(30, 41, 59); // Slate-900 style
            pdf.rect(0, 0, pageWidth, headerHeight, 'F');
            pdf.setTextColor(255, 255, 255);
            pdf.setFontSize(14);
            pdf.setFont('helvetica', 'bold');

            // Show section title if provided, otherwise default title
            const headerText = sectionTitle || `${portfolioName} | Portfolio Analysis`;
            pdf.text(headerText, margin, 11);

            pdf.setFontSize(9);
            pdf.setFont('helvetica', 'normal');
            const date = new Date().toLocaleDateString('en-IN', {
                day: '2-digit', month: 'short', year: 'numeric'
            });
            pdf.text(date, pageWidth - margin, 11, { align: 'right' });
        };

        // Helper: Add footer with orphan prevention note
        const addFooter = (current, total) => {
            pdf.setFillColor(248, 250, 252);
            pdf.rect(0, pageHeight - footerHeight, pageWidth, footerHeight, 'F');
            pdf.setTextColor(148, 163, 184);
            pdf.setFontSize(8);
            pdf.setFont('helvetica', 'italic');
            pdf.text(`${portfolioName} • Confidential`, margin, pageHeight - 5);
            pdf.setFont('helvetica', 'bold');
            pdf.text(`Page ${current} of ${total}`, pageWidth - margin, pageHeight - 5, { align: 'right' });
        };

        // Helper: Add section title page
        const addSectionTitle = (sectionNum, title, description) => {
            // Section title banner
            const bannerHeight = 40;
            currentY = margin + headerHeight + 5;

            // Number badge
            pdf.setFillColor(59, 130, 246); // Blue-500
            pdf.circle(margin + 15, currentY + 12, 12, 'F');
            pdf.setTextColor(255, 255, 255);
            pdf.setFontSize(16);
            pdf.setFont('helvetica', 'bold');
            pdf.text(String(sectionNum), margin + 15, currentY + 16, { align: 'center' });

            // Section title
            pdf.setTextColor(15, 23, 42);
            pdf.setFontSize(22);
            pdf.setFont('helvetica', 'bold');
            pdf.text(title, margin + 35, currentY + 15);

            // Description
            if (description) {
                pdf.setTextColor(100, 116, 139);
                pdf.setFontSize(11);
                pdf.setFont('helvetica', 'normal');
                pdf.text(description, margin + 35, currentY + 28);
            }

            // Underline
            pdf.setDrawColor(59, 130, 246);
            pdf.setLineWidth(1);
            pdf.line(margin, currentY + bannerHeight - 5, pageWidth - margin, currentY + bannerHeight - 5);

            currentY = currentY + bannerHeight + 10;
        };

        // ============================================
        // START PDF GENERATION
        // ============================================

        if (onProgress) onProgress('Creating cover page...', 5);

        // Add Cover Page
        await addCoverPage();

        if (onProgress) onProgress('Adding table of contents...', 10);

        // Add Table of Contents
        addTableOfContents();

        // Now add a new page for the actual content
        pdf.addPage();
        currentY = margin + headerHeight;

        // Section mapping for headers
        const sectionTitles = [
            { title: "1. Current Holdings Overview", desc: "Your portfolio composition" },
            { title: "2. Portfolio Performance Summary", desc: "Key metrics and returns" },
            { title: "3. Alpha Metrics Analysis", desc: "Excess returns measurement" },
            { title: "4. Beta Metrics & Risk Assessment", desc: "Volatility analysis" },
            { title: "5. Valuation Ratios & Metrics", desc: "P/E, P/B, Dividend Yield" },
            { title: "6. Visual Performance Catalog", desc: "Performance health and graphical analysis" },
            { title: "7. Glossary & Detailed Analysis", desc: "Definitions and formulas" },
        ];
        let currentSectionIndex = 0;

        // Query segments - only top level to avoid duplicates
        const segments = Array.from(element.querySelectorAll('.pdf-section-container')).filter(el => {
            let parent = el.parentElement;
            while (parent && parent !== element) {
                if (parent.classList.contains('pdf-section-container')) return false;
                parent = parent.parentElement;
            }
            return true;
        });

        totalSections = segments.length;

        if (totalSections === 0) {
            segments.push(element);
            totalSections = 1;
        }

        // Wait a moment for Plotly and other heavy components to stabilize
        await new Promise(resolve => setTimeout(resolve, 1000));

        let lastSectionNum = 0;

        for (const segment of segments) {
            // Determine section number from segment or its parents
            let sectionNum = 0;
            let currentEl = segment;
            while (currentEl && currentEl !== element) {
                if (currentEl.getAttribute('data-pdf-section')) {
                    sectionNum = parseInt(currentEl.getAttribute('data-pdf-section'));
                    break;
                }
                currentEl = currentEl.parentElement;
            }

            // Fallback to sequential if no data-pdf-section found
            if (!sectionNum) sectionNum = lastSectionNum + 1;

            const sectionInfo = sectionTitles[sectionNum - 1] || { title: `Section ${sectionNum}`, desc: "" };



            if (onProgress) {
                sectionsProcessed++;
                const percentage = Math.round(40 + (sectionsProcessed / totalSections) * 55);
                onProgress(`Capturing ${sectionInfo.title || 'Section'}...`, percentage);
            }

            // If section changed, force new page and add banner
            if (sectionNum !== lastSectionNum) {
                pdf.addPage();
                currentY = margin + headerHeight;
                addHeader(sectionInfo.title);
                // addSectionTitle(sectionNum, sectionInfo.title.split('. ')[1] || sectionInfo.title, sectionInfo.desc);
                lastSectionNum = sectionNum;
            }

            // Capture segment
            const dataUrl = await htmlToImage.toPng(segment, {
                quality: 1.0,
                pixelRatio: 3.0, // Increased for higher clarity
                backgroundColor: '#ffffff',
                style: { margin: '0', padding: '10px', borderRadius: '0' }
            });

            const img = new Image();
            img.src = dataUrl;
            await new Promise(resolve => { img.onload = resolve; });

            const imgAspectRatio = img.width / img.height;
            const renderWidth = contentWidth;
            let fullRenderHeight = renderWidth / imgAspectRatio;

            // PAGE BREAK LOGIC: If it doesn't fit on remaining space
            const availableHeight = maxContentHeight - (currentY - (margin + headerHeight));

            if (fullRenderHeight <= availableHeight) {
                // FITS ON CURRENT PAGE
                pdf.addImage(dataUrl, 'PNG', margin, currentY, renderWidth, fullRenderHeight, undefined, 'FAST');
                currentY += fullRenderHeight + 12;
            } else if (fullRenderHeight <= maxContentHeight) {
                // TOO BIG FOR CURRENT SPACE, BUT FITS ON A NEW PAGE
                pdf.addPage();
                currentY = margin + headerHeight;
                addHeader(sectionInfo.title);
                pdf.addImage(dataUrl, 'PNG', margin, currentY, renderWidth, fullRenderHeight, undefined, 'FAST');
                currentY += fullRenderHeight + 12;
            } else {
                // TOO BIG FOR EVEN A CLEAN PAGE -> SLICE IT
                let remainingHeight = fullRenderHeight;
                let sourcePointerY = 0;

                while (remainingHeight > 0) {
                    const spaceOnThisPage = maxContentHeight - (currentY - (margin + headerHeight));
                    const sliceRenderHeight = Math.min(remainingHeight, spaceOnThisPage);

                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    const actualSourceHeight = (sliceRenderHeight / fullRenderHeight) * img.height;

                    canvas.width = img.width;
                    canvas.height = actualSourceHeight;
                    ctx.drawImage(img, 0, sourcePointerY, img.width, actualSourceHeight, 0, 0, img.width, actualSourceHeight);

                    const sliceDataUrl = canvas.toDataURL('image/png', 1.0);
                    pdf.addImage(sliceDataUrl, 'PNG', margin, currentY, renderWidth, sliceRenderHeight, undefined, 'FAST');

                    remainingHeight -= sliceRenderHeight;
                    sourcePointerY += actualSourceHeight;
                    currentY += sliceRenderHeight;

                    if (remainingHeight > 0) {
                        pdf.addPage();
                        currentY = margin + headerHeight;
                        addHeader(sectionInfo.title);
                    }
                }
                currentY += 12;
            }
        }

        // Finalize pages (Footer)
        const pageCount = pdf.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            pdf.setPage(i);
            addFooter(i, pageCount);
        }

        const fileName = `Portfolio_Analysis_${new Date().getTime()}.pdf`;
        pdf.save(fileName);

        return { success: true, fileName };

    } catch (error) {
        console.error("Advanced PDF Export failed:", error);
        throw error;
    }
};
