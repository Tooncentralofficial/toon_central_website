export const parseArray = (item: any):any[] => {
  if (Array.isArray(item)) return item;
  return [];
};


export function formatDate(dateString:string|undefined) {
    if (!dateString) return ""
    const date = new Date(dateString);
    const options = { month: 'short', day: 'numeric' };
    const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    
    return formattedDate;
  }
  