

export default function useDateFormatter() {
    const formatAnyDate = (dateValue: any) => {
  if (!dateValue) return 'N/A';

  // 1. Convert to a real JS Date object regardless of source type
  let date: Date;
  
  if (typeof dateValue.toDate === 'function') {
    // It's a Firestore Timestamp
    date = dateValue.toDate();
  } else if (dateValue instanceof Date) {
    // It's already a JS Date
    date = dateValue;
  } else if (dateValue.seconds) {
    // It's a plain object with seconds (Firestore data that lost its methods)
    date = new Date(dateValue.seconds * 1000);
  } else {
    // It's a string or something else
    date = new Date(dateValue);
  }

  // 2. Format to "March 25, 2026"
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
};
  return {formatAnyDate}
}
