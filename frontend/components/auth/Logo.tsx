/**
 * Logo Component
 * Circular logo with star/sparkle icon matching the design
 */
export default function Logo() {
  return (
    <div className="flex justify-center mb-8">
      <div className="w-12 h-12 bg-[#d4a574] rounded-full flex items-center justify-center">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-white"
        >
          <path
            d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z"
            fill="white"
            stroke="white"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}

