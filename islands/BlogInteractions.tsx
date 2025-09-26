// islands/BlogInteractions.tsx
import { useEffect, useRef, useState } from 'preact/hooks';
import { IS_BROWSER } from "$fresh/runtime.ts";

interface BlogInteractionsProps {
  onCardClick?: (title: string) => void;
  onPageChange?: (page: number) => void;
  totalPages?: number;
  currentPage?: number;
}

/**
 * BlogInteractions Island Component
 * Provides interactive functionality for blog cards, pagination, and parallax effects
 * This component runs only on the client side.
 */
export default function BlogInteractions({
  onCardClick,
  onPageChange,
  totalPages = 3,
  currentPage = 1
}: BlogInteractionsProps) {
  const [activePage, setActivePage] = useState(currentPage);
  const blogCardsRef = useRef<HTMLDivElement[]>([]);
  const paginationRef = useRef<HTMLDivElement>(null);
  const floatingElementsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!IS_BROWSER) return;

    // Enhanced hover effects for blog cards
    const setupBlogCardInteractions = () => {
      const blogCards = document.querySelectorAll('.blog-card');
      
      blogCards.forEach((card, index) => {
        const cardElement = card as HTMLDivElement;
        blogCardsRef.current[index] = cardElement;
        
        // Enhanced hover effect with transform and scale
        const handleMouseEnter = () => {
          cardElement.style.transform = 'translateY(-8px) scale(1.02)';
          cardElement.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
        };
        
        const handleMouseLeave = () => {
          cardElement.style.transform = 'translateY(0) scale(1)';
        };

        // Click handler for blog cards
        const handleClick = () => {
          const titleElement = cardElement.querySelector('.card-title');
          if (titleElement) {
            const title = titleElement.textContent || '';
            if (onCardClick) {
              onCardClick(title);
            } else {
              // Default behavior if no handler is provided
              alert(`Opening article: ${title}`);
            }
          }
        };
        
        cardElement.addEventListener('mouseenter', handleMouseEnter);
        cardElement.addEventListener('mouseleave', handleMouseLeave);
        cardElement.addEventListener('click', handleClick);
      });
    };

    // Pagination functionality with active state management
    const setupPagination = () => {
      const paginationContainer = document.querySelector('.pagination');
      if (!paginationContainer) return;
      
      paginationRef.current = paginationContainer as HTMLDivElement;
      
      const pageButtons = paginationContainer.querySelectorAll('.page-btn');
      
      pageButtons.forEach((btn) => {
        const buttonElement = btn as HTMLButtonElement;
        
        const handleClick = () => {
          const buttonText = buttonElement.textContent || '';
          
          // Handle Previous/Next buttons
          if (buttonText.includes('Previous')) {
            if (activePage > 1) {
              const newPage = activePage - 1;
              setActivePage(newPage);
              if (onPageChange) onPageChange(newPage);
            }
          } else if (buttonText.includes('Next')) {
            if (activePage < totalPages) {
              const newPage = activePage + 1;
              setActivePage(newPage);
              if (onPageChange) onPageChange(newPage);
            }
          } else {
            // Handle numbered page buttons
            const pageNum = parseInt(buttonText);
            if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
              setActivePage(pageNum);
              if (onPageChange) onPageChange(pageNum);
            }
          }
          
          // Update active state visually
          updatePaginationActiveState();
        };
        
        buttonElement.addEventListener('click', handleClick);
      });
    };

    // Update pagination active state
    const updatePaginationActiveState = () => {
      if (!paginationRef.current) return;
      
      const pageButtons = paginationRef.current.querySelectorAll('.page-btn');
      
      pageButtons.forEach((btn: Element) => {
        const buttonElement = btn as HTMLButtonElement;
        const buttonText = buttonElement.textContent || '';
        
        // Remove active class from all buttons
        buttonElement.classList.remove('active');
        
        // Add active class to current page button
        if (!buttonText.includes('Previous') && !buttonText.includes('Next')) {
          const pageNum = parseInt(buttonText);
          if (pageNum === activePage) {
            buttonElement.classList.add('active');
          }
        }
      });
    };

    // Parallax effect for floating elements
    const setupParallaxEffect = () => {
      const floatingContainer = document.querySelector('.floating-elements');
      if (!floatingContainer) return;
      
      floatingElementsRef.current = floatingContainer as HTMLDivElement;
      
      let mouseX = 0, mouseY = 0;
      
      const handleMouseMove = (e: MouseEvent) => {
        mouseX = e.clientX / window.innerWidth;
        mouseY = e.clientY / window.innerHeight;
        
        const floatingCircles = floatingContainer.querySelectorAll('.floating-circle');
        
        floatingCircles.forEach((circle) => {
          const circleElement = circle as HTMLDivElement;
          const speed = 0.5; // Default speed
          const translateX = mouseX * 20 * speed;
          const translateY = mouseY * 20 * speed;
          
          // Preserve the original animation while adding parallax
          const currentTransform = circleElement.style.transform || '';
          const rotateMatch = currentTransform.match(/rotate\([^)]*\)/);
          const rotatePart = rotateMatch ? rotateMatch[0] : 'rotate(0deg)';
          
          circleElement.style.transform = `translate(${translateX}px, ${translateY}px) ${rotatePart}`;
        });
      };
      
      document.addEventListener('mousemove', handleMouseMove);
      
      // Cleanup
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
      };
    };

    // Initialize all interactions
    setupBlogCardInteractions();
    setupPagination();
    updatePaginationActiveState();
    const parallaxCleanup = setupParallaxEffect();
    
    // Cleanup function
    return () => {
      if (parallaxCleanup) parallaxCleanup();
      
      // Clean up blog card event listeners
      blogCardsRef.current.forEach((card: HTMLDivElement | null) => {
        if (card) {
          // Clone and replace to remove all event listeners
          const newCard = card.cloneNode(true);
          if (card.parentNode) {
            card.parentNode.replaceChild(newCard, card);
          }
        }
      });
      
      // Clean up pagination event listeners
      if (paginationRef.current) {
        const pageButtons = paginationRef.current.querySelectorAll('.page-btn');
        pageButtons.forEach((btn: Element) => {
          const buttonElement = btn as HTMLButtonElement;
          // Clone and replace to remove all event listeners
          const newButton = buttonElement.cloneNode(true);
          if (buttonElement.parentNode) {
            buttonElement.parentNode.replaceChild(newButton, buttonElement);
          }
        });
      }
    };
  }, [activePage, totalPages, onCardClick, onPageChange]);

  // This component doesn't render anything visible
  // It only adds interactivity to existing elements
  return null;
}