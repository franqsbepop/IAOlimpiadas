import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

interface GradientDescentVizProps {
  learningRate: number;
  epochs: number;
  isRunning: boolean;
  onComplete: () => void;
}

export function GradientDescentViz({
  learningRate,
  epochs,
  isRunning,
  onComplete
}: GradientDescentVizProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [iteration, setIteration] = useState(0);
  const [currentPosition, setCurrentPosition] = useState<[number, number]>([0, 0]);
  
  // Simulated cost function (parabola)
  const costFunction = (x: number, y: number) => 0.1 * Math.pow(x - 3, 2) + 0.1 * Math.pow(y - 2, 2) + 1;
  
  // Simulated gradients
  const gradientX = (x: number) => 0.2 * (x - 3);
  const gradientY = (y: number) => 0.2 * (y - 2);
  
  // Reset animation when props change
  useEffect(() => {
    setIteration(0);
    setCurrentPosition([Math.random() * 6, Math.random() * 5]);
  }, [learningRate, epochs]);
  
  // Animation effect
  useEffect(() => {
    if (!isRunning || !svgRef.current) return;
    
    const animationId = setInterval(() => {
      if (iteration >= epochs) {
        clearInterval(animationId);
        onComplete();
        return;
      }
      
      setIteration(prev => prev + 1);
      setCurrentPosition(([x, y]) => {
        const newX = x - learningRate * gradientX(x);
        const newY = y - learningRate * gradientY(y);
        return [newX, newY];
      });
    }, 100);
    
    return () => clearInterval(animationId);
  }, [isRunning, iteration, epochs, learningRate, onComplete]);
  
  // D3 visualization effect
  useEffect(() => {
    if (!svgRef.current) return;
    
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
    
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;
    const margin = { top: 20, right: 20, bottom: 40, left: 40 };
    
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    
    // Create scales
    const xScale = d3.scaleLinear()
      .domain([0, 6])
      .range([0, innerWidth]);
      
    const yScale = d3.scaleLinear()
      .domain([0, 5])
      .range([innerHeight, 0]);
    
    // Create contour data for the cost function
    const numPoints = 50;
    const contourData: number[][] = [];
    
    for (let i = 0; i < numPoints; i++) {
      contourData[i] = [];
      for (let j = 0; j < numPoints; j++) {
        const x = (i / numPoints) * 6;
        const y = (j / numPoints) * 5;
        contourData[i][j] = costFunction(x, y);
      }
    }
    
    // Main group
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);
    
    // Create contour generator
    const contours = d3.contours()
      .size([numPoints, numPoints])
      .thresholds(Array.from({ length: 15 }, (_, i) => 1 + i * 0.2))
      (contourData.flat());
    
    // Color scale for contours
    const colorScale = d3.scaleSequential(d3.interpolateYlGnBu)
      .domain([1, 4]);
    
    // Draw contours
    g.append('g')
      .selectAll('path')
      .data(contours)
      .enter()
      .append('path')
      .attr('d', d3.geoPath(d3.geoIdentity().scale(innerWidth / numPoints)))
      .attr('fill', d => colorScale(d.value))
      .attr('stroke', 'rgba(0, 0, 0, 0.1)')
      .attr('stroke-width', 0.5);
    
    // Draw axes
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale).ticks(5))
      .append('text')
      .attr('fill', 'currentColor')
      .attr('x', innerWidth / 2)
      .attr('y', 35)
      .attr('text-anchor', 'middle')
      .text('Parâmetro θ₁');
    
    g.append('g')
      .call(d3.axisLeft(yScale).ticks(5))
      .append('text')
      .attr('fill', 'currentColor')
      .attr('transform', 'rotate(-90)')
      .attr('y', -35)
      .attr('x', -innerHeight / 2)
      .attr('text-anchor', 'middle')
      .text('Parâmetro θ₂');
    
    // Draw optimal point
    g.append('circle')
      .attr('cx', xScale(3))
      .attr('cy', yScale(2))
      .attr('r', 5)
      .attr('fill', 'rgba(255, 0, 0, 0.5)')
      .attr('stroke', 'black')
      .attr('stroke-width', 1);
    
    // Previous path points
    const pathPoints: Array<[number, number]> = [currentPosition];
    
    // Draw path
    const linePath = g.append('path')
      .attr('fill', 'none')
      .attr('stroke', '#ff5722')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '5,3')
      .attr('d', d3.line()
        .x(d => xScale(d[0]))
        .y(d => yScale(d[1]))
        (pathPoints));
    
    // Draw current position
    const point = g.append('circle')
      .attr('cx', xScale(currentPosition[0]))
      .attr('cy', yScale(currentPosition[1]))
      .attr('r', 7)
      .attr('fill', '#ff5722')
      .attr('stroke', 'white')
      .attr('stroke-width', 2);
    
    // Update path and point position
    if (iteration > 0) {
      // Add new point to path
      pathPoints.push(currentPosition);
      
      // Update path
      linePath.attr('d', d3.line()
        .x(d => xScale(d[0]))
        .y(d => yScale(d[1]))
        (pathPoints));
      
      // Update point position
      point
        .attr('cx', xScale(currentPosition[0]))
        .attr('cy', yScale(currentPosition[1]));
    }
    
    // Add legend
    const legend = g.append('g')
      .attr('transform', `translate(${innerWidth - 130}, 20)`)
      .attr('font-family', 'sans-serif')
      .attr('font-size', 10);
    
    legend.append('circle')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', 5)
      .attr('fill', 'rgba(255, 0, 0, 0.5)')
      .attr('stroke', 'black');
    
    legend.append('text')
      .attr('x', 10)
      .attr('y', 3)
      .text('Mínimo global');
    
    legend.append('circle')
      .attr('cx', 0)
      .attr('cy', 20)
      .attr('r', 5)
      .attr('fill', '#ff5722')
      .attr('stroke', 'white')
      .attr('stroke-width', 2);
    
    legend.append('text')
      .attr('x', 10)
      .attr('y', 23)
      .text('Posição atual');
    
    // Add iteration counter
    g.append('text')
      .attr('x', 10)
      .attr('y', 20)
      .attr('font-family', 'sans-serif')
      .attr('font-size', 12)
      .text(`Iteração: ${iteration}/${epochs}`);
    
    // Add cost value
    g.append('text')
      .attr('x', 10)
      .attr('y', 40)
      .attr('font-family', 'sans-serif')
      .attr('font-size', 12)
      .text(`Custo: ${costFunction(currentPosition[0], currentPosition[1]).toFixed(3)}`);
    
  }, [currentPosition, iteration, epochs, isRunning]);
  
  return (
    <div className="gradient-descent-visualization w-full h-full">
      <svg 
        ref={svgRef} 
        className="w-full h-full"
        viewBox="0 0 500 400"
        preserveAspectRatio="xMidYMid meet"
      />
    </div>
  );
}