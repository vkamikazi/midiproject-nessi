import "./SortButton.css";

function SortButton({ column, sorting, onSort, children }) {
  const getIcon = () => {
    switch (sorting) {
      case 1 /* descending */:
        return (
          <svg width="10" height="10" viewBox="0 0 10 10">
            <path
              d="M1 2 L5 8 L9 2"
              stroke="black"
              fill="none"
              stroke-width="2"
            />
          </svg>
        );
      case 2 /* ascending */:
        return (
          <svg width="10" height="10" viewBox="0 0 10 10">
            <path
              d="M1 9 L5 3 L9 9"
              stroke="black"
              fill="none"
              stroke-width="2"
            />
          </svg>
        );
      default:
        /* not sorted */ return (
          <svg width="10" height="10" viewBox="0 0 10 10">
            <rect x="1" y="4" width="8" height="2" fill="black" />
          </svg>
        );
    }
  };

  return (
    <button onClick={() => onSort(column)}>
      <span>{children}</span>
      <span>{getIcon()}</span>
    </button>
  );
}

export default SortButton;
