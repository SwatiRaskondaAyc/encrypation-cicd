package com.example.prog.utils;

import com.example.prog.entity.dashboard.EquityHubPlotDTO;
import com.example.prog.entity.dashboard.PortfolioPlotDTO;
import org.jfree.chart.ChartFactory;
import org.jfree.chart.JFreeChart;
import org.jfree.chart.plot.CategoryPlot;
import org.jfree.chart.plot.PlotOrientation;
import org.jfree.chart.plot.XYPlot;
import org.jfree.chart.renderer.xy.CandlestickRenderer;
import org.jfree.data.category.DefaultCategoryDataset;
import org.jfree.data.xy.DefaultHighLowDataset;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Base64;
import java.util.Date;
import java.util.List;

public class ChartGenerator {

    private static final Logger logger = LoggerFactory.getLogger(ChartGenerator.class);
    private static final int CHART_WIDTH = 800;
    private static final int CHART_HEIGHT = 400;

    public static String generateDashboardScreenshot(List<EquityHubPlotDTO> equityPlots, 
                                                    List<PortfolioPlotDTO> portfolioPlots) throws IOException {
        logger.info("Generating single screenshot for {} EquityHub plots and {} Portfolio plots", 
                    equityPlots.size(), portfolioPlots.size());

        // Combine all plots
        List<Object> allPlots = new ArrayList<>();
        allPlots.addAll(equityPlots);
        allPlots.addAll(portfolioPlots);

        if (allPlots.isEmpty()) {
            logger.warn("No plots to generate screenshot for");
            // Create a blank image as fallback
            BufferedImage blankImage = new BufferedImage(CHART_WIDTH, CHART_HEIGHT, BufferedImage.TYPE_INT_ARGB);
            Graphics2D g2d = blankImage.createGraphics();
            g2d.setColor(Color.WHITE);
            g2d.fillRect(0, 0, CHART_WIDTH, CHART_HEIGHT);
            g2d.dispose();
            return convertToBase64(blankImage);
        }

        // Calculate total height
        int totalHeight = allPlots.size() * CHART_HEIGHT;
        BufferedImage combinedImage = new BufferedImage(CHART_WIDTH, totalHeight, BufferedImage.TYPE_INT_ARGB);
        Graphics2D g2d = combinedImage.createGraphics();
        int yOffset = 0;

        // Generate and draw each plot
        for (Object plot : allPlots) {
            JFreeChart chart = createChart(plot);
            BufferedImage chartImage = chart.createBufferedImage(CHART_WIDTH, CHART_HEIGHT);
            g2d.drawImage(chartImage, 0, yOffset, null);
            yOffset += CHART_HEIGHT;
        }

        g2d.dispose();

        // Convert to base64
        String base64Image = convertToBase64(combinedImage);
        logger.info("Generated single screenshot with size {} bytes", base64Image.length());
        return base64Image;
    }

    private static JFreeChart createChart(Object plot) {
        if (plot instanceof EquityHubPlotDTO) {
            EquityHubPlotDTO equityPlot = (EquityHubPlotDTO) plot;
            if ("Candle Spread".equalsIgnoreCase(equityPlot.getGraphType())) {
                return createCandlestickChart(equityPlot);
            }
        } else if (plot instanceof PortfolioPlotDTO) {
            PortfolioPlotDTO portfolioPlot = (PortfolioPlotDTO) plot;
            if ("top_ten_script".equalsIgnoreCase(portfolioPlot.getGraphType())) {
                return createBarChart(portfolioPlot);
            }
        }
        logger.warn("Unsupported plot type: {}", plot.getClass().getSimpleName());
        return createEmptyChart();
    }

    private static JFreeChart createCandlestickChart(EquityHubPlotDTO plot) {
        logger.debug("Creating candlestick chart for symbol: {}", plot.getSymbol());

        // Placeholder data (replace with actual data from your database/service)
        LocalDate[] localDates = {LocalDate.now().minusDays(4), LocalDate.now().minusDays(3), 
                                 LocalDate.now().minusDays(2), LocalDate.now().minusDays(1), 
                                 LocalDate.now()};
        // Convert LocalDate[] to Date[]
        Date[] dates = new Date[localDates.length];
        for (int i = 0; i < localDates.length; i++) {
            dates[i] = Date.from(localDates[i].atStartOfDay(ZoneId.systemDefault()).toInstant());
        }
        double[] high = {100.0, 102.0, 105.0, 103.0, 107.0};
        double[] low = {95.0, 97.0, 100.0, 98.0, 102.0};
        double[] open = {98.0, 100.0, 103.0, 101.0, 104.0};
        double[] close = {97.0, 101.0, 104.0, 100.0, 106.0};
        double[] volume = {1000.0, 1200.0, 1100.0, 1300.0, 1400.0};

        DefaultHighLowDataset dataset = new DefaultHighLowDataset(
                plot.getSymbol(), dates, high, low, open, close, volume);

        JFreeChart chart = ChartFactory.createCandlestickChart(
                plot.getCompanyName() + " (" + plot.getSymbol() + ")",
                "Date", "Price", dataset, false);
        XYPlot xyPlot = chart.getXYPlot();
        CandlestickRenderer renderer = new CandlestickRenderer();
        renderer.setUpPaint(Color.GREEN);
        renderer.setDownPaint(Color.RED);
        xyPlot.setRenderer(renderer);
        return chart;
    }

    private static JFreeChart createBarChart(PortfolioPlotDTO plot) {
        logger.debug("Creating bar chart for portfolio plot: {}", plot.getGraphType());

        // Placeholder data (replace with actual data from your database/service)
        DefaultCategoryDataset dataset = new DefaultCategoryDataset();
        dataset.addValue(10.0, "Holdings", "Stock A");
        dataset.addValue(15.0, "Holdings", "Stock B");
        dataset.addValue(12.0, "Holdings", "Stock C");
        dataset.addValue(8.0, "Holdings", "Stock D");
        dataset.addValue(20.0, "Holdings", "Stock E");

        JFreeChart chart = ChartFactory.createBarChart(
                "Top 10 Holdings (" + plot.getPlatform() + ")",
                "Stock", "Value", dataset, PlotOrientation.VERTICAL, true, true, false);
        CategoryPlot categoryPlot = chart.getCategoryPlot();
        categoryPlot.setBackgroundPaint(Color.WHITE);
        categoryPlot.setDomainGridlinePaint(Color.BLACK);
        categoryPlot.setRangeGridlinePaint(Color.BLACK);
        return chart;
    }

    private static JFreeChart createEmptyChart() {
        DefaultCategoryDataset dataset = new DefaultCategoryDataset();
        return ChartFactory.createBarChart(
                "No Data", "Category", "Value", dataset, PlotOrientation.VERTICAL, false, false, false);
    }

    private static String convertToBase64(BufferedImage image) throws IOException {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        ImageIO.write(image, "png", baos);
        byte[] imageBytes = baos.toByteArray();
        return "data:image/png;base64," + Base64.getEncoder().encodeToString(imageBytes);
    }
}
