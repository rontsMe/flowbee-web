// utils/RowLayoutCalculator.ts

import { RowCalculationResult } from './types';

/**
 * RowLayoutCalculator - Vanilla JS Grid Layout Calculator
 * Purpose: Calculate actual row positions and sibling relationships in CSS grid
 * Methods:
 * - calculateRowLayout(): Inspects DOM to determine cards per row
 * - findCardRow(): Finds which row a specific card is in
 * - getSiblingIndices(): Gets indices of cards in same row as target card
 */
export class RowLayoutCalculator {
  
  /**
   * calculateRowLayout - Determines actual grid layout from DOM
   * @param containerRef - Grid container HTML element
   * @param cardCount - Total number of cards
   * @returns RowCalculationResult with layout information
   */
  calculateRowLayout(containerRef: HTMLElement, cardCount: number): RowCalculationResult {
    if (!containerRef || cardCount === 0) {
      return {
        cardsPerRow: 1,
        totalRows: 0,
        cardPositions: []
      };
    }

    const children = Array.from(containerRef.children) as HTMLElement[];
    
    if (children.length === 0) {
      return {
        cardsPerRow: 1,
        totalRows: 0,
        cardPositions: []
      };
    }

    // Group cards by their offsetTop (same row = same offsetTop)
    const rowGroups = new Map<number, number[]>();
    
    children.forEach((child, index) => {
      const top = child.offsetTop;
      if (!rowGroups.has(top)) {
        rowGroups.set(top, []);
      }
      rowGroups.get(top)!.push(index);
    });

    // Sort row groups by offsetTop to get correct row order
    const sortedRowGroups = Array.from(rowGroups.entries())
      .sort(([topA], [topB]) => topA - topB)
      .map(([, indices]) => indices);

    // Calculate cards per row (use first row as reference)
    const cardsPerRow = sortedRowGroups[0]?.length || 1;
    const totalRows = sortedRowGroups.length;

    // Create position array: cardPositions[cardIndex] = rowNumber
    const cardPositions: number[] = new Array(cardCount).fill(0);
    
    sortedRowGroups.forEach((cardIndices, rowIndex) => {
      cardIndices.forEach(cardIndex => {
        cardPositions[cardIndex] = rowIndex;
      });
    });

    return {
      cardsPerRow,
      totalRows,
      cardPositions
    };
  }

  /**
   * findCardRow - Finds which row a specific card is in
   * @param cardIndex - Index of target card
   * @param cardsPerRow - Number of cards per row
   * @returns Row number (0-based)
   */
  findCardRow(cardIndex: number, cardsPerRow: number): number {
    return Math.floor(cardIndex / cardsPerRow);
  }

  /**
   * getSiblingIndices - Gets indices of cards in same row as target card
   * @param cardIndex - Index of target card
   * @param cardsPerRow - Number of cards per row
   * @param totalCards - Total number of cards
   * @returns Array of sibling card indices (excluding target card)
   */
  getSiblingIndices(cardIndex: number, cardsPerRow: number, totalCards: number): number[] {
    const rowNumber = this.findCardRow(cardIndex, cardsPerRow);
    const rowStartIndex = rowNumber * cardsPerRow;
    const rowEndIndex = Math.min(rowStartIndex + cardsPerRow, totalCards);
    
    const siblings: number[] = [];
    
    for (let i = rowStartIndex; i < rowEndIndex; i++) {
      if (i !== cardIndex) {  // Exclude the target card itself
        siblings.push(i);
      }
    }
    
    return siblings;
  }

  /**
   * isCardAloneInRow - Checks if card has no siblings in its row
   * @param cardIndex - Index of target card
   * @param cardsPerRow - Number of cards per row
   * @param totalCards - Total number of cards
   * @returns True if card is alone in its row
   */
  isCardAloneInRow(cardIndex: number, cardsPerRow: number, totalCards: number): boolean {
    const siblings = this.getSiblingIndices(cardIndex, cardsPerRow, totalCards);
    return siblings.length === 0;
  }
}