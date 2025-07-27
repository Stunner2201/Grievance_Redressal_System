const mapToDepartment = (complaintText) => {
  const keywords = {
    1: ['road', 'pothole', 'bridge', 'construction'],
    2: ['garbage', 'water', 'sanitation', 'drainage'],
    3: ['electric', 'power', 'transformer', 'street light'],
    4: ['hospital', 'doctor', 'medicine', 'health'],
    5: ['police', 'crime', 'theft', 'accident']
  };

  complaintText = complaintText.toLowerCase();
  
  for (const [deptId, terms] of Object.entries(keywords)) {
    if (terms.some(term => complaintText.includes(term))) {
      return parseInt(deptId);
    }
  }
  
  return 2; // Default to Municipal Corporation
};