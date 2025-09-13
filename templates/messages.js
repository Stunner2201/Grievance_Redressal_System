// messages.js

// Import department data from local JSON
const departmentData = require('./department');

// ========================
// WARD AND COLONY DATA
// ========================

// List of all wards (simplified to just numbers)
const wards = Array.from({length: 22}, (_, i) => `${i + 1}`);

// Ward number to colony mapping
const wardColonies = {
  "1": [
    "IE Kutana (old idc)",
    "JP Colony",
    "Sanik Colony Industrial Area",
    "Shastri Nagar Hisar Rd.",
    "Area Near IDC",
    "Surya Nagar Singhpura Rd",
    "Basti Kutana",
    "Surya Nagar Ext-03,04",
    "Kutana Village"
  ],
  "2": [
    "Kartarpura",
    "Nehru Colony",
    "Saini Anandpura",
    "Sanjay Colony (kodhiColony)",
    "Indira Colony",
    "Shiv Colony",
    "Barsi Nagar",
    "Moti Nagar",
    "Shyam Colony"
  ],
  "3": [
    "Babra Mohalla",
    "Kacchi Garhi",
    "Krishna Colony Near Railway Line",
    "Krishna Colony Near Gaur College",
    "Local ram Leela Ground Near Old Bus Stand",
    "Nand Colony",
    "Pakki Garhi",
    "Chamra Karkhana kacchi Garhi Ambedkar Nagar",
    "Darwaja Mohalla",
    "Gopal Colony",
    "Pili Kothi"
  ],
  "4": [
    "Laxmanpuri Near Gau Karan Park",
    "Shora Kothi",
    "Gopalpura",
    "Sainiwas",
    "Rainkpura",
    "Kabir Colony Near Khokhra Kot",
    "Balaknath Colony",
    "Fauji Colony",
    "Anantpuram",
    "Peer Colony",
    "Dairy Mohalla"
  ],
  "5": [
    "Hanuman Colony",
    "Tej Colony",
    "Rajiv Nagar Kaccha Chamaria Rd.",
    "Salara Mohalla",
    "Rajiv Nagar 2023",
    "Rajiv Nagar Colony",
    "One City",
    "Rajiv Nagar Part-ll",
    "Om City near One City",
    "Rajiv Nagar Ext -ll Urban No 6630,6738",
    "Krishna Colony Kaccha Chamaria Rd.",
    "Khokharkot",
    "Fatehpuri Colony"
  ],
  "6": [
    "Pradhana Mohalla",
    "Silara Mohalla",
    "Brahman Mandi",
    "Dhobi Mohalla",
    "Kalalan Mohalla",
    "Kayasthan",
    "Kewal Ganj",
    "Paras Mohalla",
    "Pithwara Mohalla",
    "Pratap Mohalla",
    "Tibdi Mohalla"
  ],
  "7": [
    "Sanjay Nagar",
    "Kirpal Colony",
    "Gurunanak Pura",
    "Krishna Colony Gohana Rd.",
    "Mahabir Colony",
    "Ashok Nagar",
    "Palika Bazar Krishna Colony",
    "Para Mohalla",
    "Saini Dass Colony",
    "Qilla Mohalla"
  ],
  "8": [
    "Bhagat Singh Colony Radh Rd",
    "Bhagwan Colony",
    "Chaman Pura",
    "Chunnipura",
    "Ganga Bishan Nagar",
    "New Rajender Nagar",
    "Prem Nagar",
    "Sainipura",
    "Surya Nagar_Gohana Rd"
  ],
  "9": [
    "Sukhpura",
    "Surya Nagar Ladhot Rd",
    "Azad Garh",
    "Chhotu Ram Nagar",
    "Harki Devi Colony",
    "Inderprasth Colony",
    "Jasbir Colony",
    "Kabir Colony",
    "Kailash Colony",
    "Kishan Pura",
    "Laxmi Nagar",
    "Parvesh Nagar",
    "Rajendra Nagar",
    "Rishi Nagar Ladhot",
    "Uttam Vihar",
    "Basant Vihar",
    "Vishal Nagar",
    "Shastri Nagar",
    "Sector 37",
    "Rajinder Nagar",
    "Sector 3,4,5,6",
    "Rishi Nagar Ext",
    "Vikash Nagar"
  ],
  "10": [
    "Sector 4 Ext",
    "Bohar Outer",
    "Garhi Bohar Outer",
    "Sector 36 A",
    "Sector 34,35,36",
    "Bohar",
    "Garhi Bohar",
    "Masthnath Nagar",
    "Masthnath Nagar Colony II",
    "Mastnath Nagar Part II",
    "Vinay Nagar Near Garhi Bohar",
    "Sector 31,30,33",
    "Wazir Nagar"
  ],
  "11": [
    "IMT Rohtak HSIIDC",
    "Sector 26,27,28",
    "Friends Colony",
    "Asthal Bohr Colony",
    "Ghari Majra",
    "Kher Sadh Outer",
    "DHL Infratech",
    "OMEX City",
    "M2M",
    "Government Employees Society",
    "Kheri Sadh",
    "Baliana",
    "Majra Village",
    "One City near Kheri Sadh"
  ],
  "12": [
    "Sector 3",
    "Sector 2",
    "Sector 1",
    "Tau Nagar Ext"
  ],
  "13": [
    "Adarsh Nagar",
    "Bharat Colony",
    "Chhotu Ram Nagar",
    "Daryao Singh Nagar",
    "Dev Colony",
    "Nirmal Nagar",
    "Chanakpuri Colony",
    "MD University",
    "Officer Colony",
    "Ram Gopal Colony",
    "Sector 14",
    "Tau Nagar Ext",
    "Tilak Nagar",
    "Vinay Nagar",
    "Rajiv Nagar Medical More"
  ],
  "14": [
    "Shree Nagar",
    "Chand Nagar",
    "Durga Colony",
    "Mansarover Colony",
    "Model Town",
    "Roop Vihar",
    "Chinout Colony",
    "Subhash Nagar",
    "Jhang Colony"
  ],
  "15": [
    "Canal Colony",
    "Arjun Nagar",
    "Chinout Colony",
    "Patel Nagar",
    "Jawahar Nagar",
    "Gandhi Nagar Ward 4,5,6",
    "Gandhi Nagar Ward 1,2,3",
    "Shree Nagar",
    "New Chhinout Colony"
  ],
  "16": [
    "Mini Secretariat Office",
    "Chawla Colony",
    "Geeta Colony",
    "Neta Ji Nagar",
    "Ram Nagar Near Jagdish Colony",
    "Tek Nagar",
    "DLF Colony",
    "Partap Nagar",
    "Jagdish Colony",
    "Shivaji Colony"
  ],
  "17": [
    "Pech Paras Ram",
    "Old Anaj Mandi",
    "HUDA Complex HSVP",
    "Shivam Enclave",
    "Bahestipura",
    "Shori Market",
    "Peer Ji Mohalla",
    "Mahajan Parao",
    "Railway Road",
    "Jain Jati Mohalla",
    "Sarai Mohalla",
    "Sant Nagar",
    "Arya Nagar",
    "Ramsukh Dass Colony",
    "Pech Kapoor Chand",
    "Shastri Nagar",
    "Ram Sukh dass colony",
    "Ravidas Nagar",
    "Hari Nagar",
    "Udmipura",
    "Ghanipura",
    "Shakti Nagar",
    "Vinay Nagar HUDA",
    "Gher Ram Phool"
  ],
  "18": [
    "Alaknanda Colony",
    "Geetanjali",
    "Gurcharanpura",
    "Islampura Dairies",
    "Janta Colony",
    "Krishna Colony Railway",
    "Meat Market",
    "New Aggarsain Colony",
    "New Aggarsain Colony Ext",
    "New Grain Market",
    "New Janta Colony Extn",
    "New Janta Colony",
    "Palika Colony",
    "Rajendra Colony",
    "Rajendra Colony Extn",
    "Ram Bagh",
    "Sector 18",
    "Sector 21,21A",
    "Shiv Nagar",
    "Vaish Institute"
  ],
  "19": [
    "Naya Padav",
    "Janta Colony Jhajjar Road",
    "Ram Nagar Kathmandi"
  ],
  "20": [
    "Azad Nagar",
    "Vijay Nagar Jhajjar Road",
    "Housing Board Colony",
    "Sugar Mill Colony",
    "Devi Vihar",
    "Hari Singh Colony",
    "Kamla Nagar",
    "Shiwaji Colony",
    "Preet Vihar",
    "Old House Colony"
  ],
  "21": [
    "Dairy Complex",
    "Ambedkar Colony",
    "Chhotu Ram Colony",
    "Ekta Colony",
    "Ajit Colony",
    "Amrit Colony",
    "Sheetal Nagar",
    "New Vijay Nagar",
    "Anand Nagar",
    "Kanheli",
    "Sector 25",
    "Peharwar"
  ],
  "22": [
    "Sector 20",
    "Sector 21 B,C,D,E",
    "Gokul Colony",
    "Shree Ram Nagar Sunaria Road",
    "Kunj Vihar",
    "Sher Vihar",
    "Sector 22A,B,C,D",
    "Sunaria Village"
  ]
};

// ========================
// RURAL AREA DATA
// ========================

// List of all blocks
const blocks = [
  "Sampla",
  "Lakhan Majra",
  "Kalanaur",
  "Meham",
  "Rohtak"
];

// Block to village mapping
const blockVillages = {
  "Sampla": [
    "Atail",
    "Bhainsru Kalan",
    "Bhainsru Khurd",
    "Chuliana Duhan",
    "Chuliana Roj",
    "Dattaur",
    "Gandhra",
    "Garhi Sampla",
    "Gijhi",
    "Hassangarh",
    "Ismaila 9 B",
    "Ismaila 11 B",
    "Karor",
    "Kharawar",
    "Kisrenti",
    "Kultana",
    "MorKheri",
    "Naya Bans",
    "Nonand",
    "Pakasma",
    "Samchana"
  ],
  "Lakhan Majra": [
    "Bainsi",
    "Chandi",
    "Chiri",
    "Garauthi",
    "Gugaheri",
    "Indergarh",
    "Kharainti",
    "Kharak Jatan",
    "Lakhan Majra",
    "Nandal",
    "Sasrauli",
    "Sunderpur",
    "Titoli"
  ],
  "Kalanaur": [
    "Anwal",
    "Ballab",
    "Baniyani",
    "Basana",
    "Bhali Anandpur",
    "Garhi Ballab",
    "Garnawathi",
    "Gudhan",
    "Jindran",
    "Kahnaur",
    "Kakrana",
    "Katesra",
    "Kherari",
    "Lahli",
    "Marodhi Jattan",
    "Marodhi Rangran",
    "Masoodpur",
    "Nigana",
    "Patwapur",
    "Pilana",
    "Saimpal",
    "Sangahera",
    "Sundana",
    "Taimurpur"
  ],
  "Meham": [
    "Ajaib",
    "Ajaib Khas",
    "Bahlba",
    "Bahlba Bajan",
    "Bahlba Khas",
    "Bahlba Panri",
    "Bedwa",
    "Bhaini Bhainro",
    "Bhaini Chanderpal",
    "Bhaini Maharajpur",
    "Bhaini Mato",
    "Bhaini Surjan",
    "Bharan Jindran",
    "Bharan Sekhupur Titri",
    "Farmana Badshahpur",
    "Farmana Khas",
    "Gorawar",
    "Kharkara Bhikhlan",
    "Kharkara Chhajan",
    "Kheri Meham",
    "Krishangarh",
    "Madina Gindhran Davitia",
    "Madina Gindhran Pratham",
    "Madina Kaursan",
    "Mokhra Khandain Chhajan",
    "Mokhra Khas",
    "Mokhra Kheri",
    "Mokhra Roj",
    "Muradpur Tekna",
    "Nidana",
    "Nindana Khas",
    "Nindana Mohammadpur",
    "Nindana Tigri",
    "Seman",
    "Seman Pana Todar",
    "Sisar Khas"
  ],
  "Rohtak": [
    "Assan",
    "Bahu Akbarpur",
    "Bahu Jamalpur",
    "Bakheta",
    "Baland",
    "Barahmanwash",
    "Basantpur",
    "Bhagwatipur",
    "Bhaiyapur",
    "Bhalout",
    "Chamaria",
    "Dhamar",
    "Dobh",
    "Gaddi Kheri",
    "Ghilor Kalan",
    "Ghilor Khurd",
    "Ghuskani",
    "Humayupur",
    "Jasia",
    "Jindran",
    "Kabulpur",
    "Kanhi 12.5",
    "Kanhi 7.5",
    "Kansala",
    "Karontha",
    "Katwara",
    "Khidwali",
    "Kiloi Dopana",
    "Kiloi Khas",
    "Ladhot",
    "Makroli Kalan",
    "Makroli Khurd",
    "Mayna",
    "Mungan",
    "Sarai Ahmad Nasirpur",
    "Pana Dudan",
    "Polangi",
    "Rithal Narwal",
    "Rithal Phougat",
    "Ritoli",
    "Rurkee",
    "Samagopalpur Kalan",
    "Samargopalpur Khurd",
    "Sanghi",
    "Shimali",
    "Singhpura Kalan",
    "Singhpura Khurd",
    "Taja Majra"
  ]
};

// Function to shorten village names
const shortenVillageName = (name) => {
  const abbreviations = {
    "Kalan": "Kln",
    "Khurd": "Khd",
    "Chanderpal": "Chand",
    "Maharajpur": "Maharaj",
    "Badshahpur": "Badshah",
    "Krishangarh": "Krishan",
    "Mohammadpur": "Mohd",
    "Narwal": "Nwl",
    "Phougat": "Phgt",
    "Gopalpur": "Gplp",
    "Singhpura": "Singh",
    "Extension": "Ext",
    "Colony": "Col",
    "Near": "Nr",
    "Road": "Rd",
    "Number": "No",
    "Industrial": "Ind",
    "Area": "Area",
    "Nagar": "Ngr",
    "Complex": "Cmp",
    "Market": "Mkt"
  };

  let shortened = name;
  
  // Apply abbreviations
  Object.keys(abbreviations).forEach(full => {
    const regex = new RegExp(`\\b${full}\\b`, 'gi');
    shortened = shortened.replace(regex, abbreviations[full]);
  });
  
  // Remove common words that can be implied
  shortened = shortened
    .replace(/\b(and|&|the|of|in|at|on|for)\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
  
  // Limit length if still too long
  if (shortened.length > 25) {
    shortened = shortened.substring(0, 22) + '...';
  }
  
  return shortened;
};

// Function to shorten colony names
const shortenColonyName = (name) => {
  const abbreviations = {
    "Colony": "Col",
    "Near": "Nr",
    "Extension": "Ext",
    "Sector": "Sec",
    "Road": "Rd",
    "Number": "No",
    "Industrial": "Ind",
    "Area": "Area",
    "Nagar": "Ngr",
    "Complex": "Cmp",
    "Market": "Mkt",
    "Department": "Dept",
    "Hospital": "Hosp",
    "School": "Sch",
    "University": "Univ",
    "Institute": "Inst",
    "Government": "Govt",
    "Private": "Pvt",
    "Public": "Pub",
    "Limited": "Ltd",
    "Corporation": "Corp",
    "Development": "Dev",
    "Authority": "Auth",
    "Board": "Bd",
    "Office": "Off",
    "Building": "Bldg",
    "Apartment": "Apt",
    "Residency": "Res",
    "Enclave": "Enc",
    "Vihar": "Vhr",
    "Puram": "Prm",
    "Garhi": "Grh",
    "Mohalla": "Mhl",
    "Chowk": "Chk",
    "Circle": "Cir",
    "Square": "Sq",
    "Street": "St",
    "Avenue": "Ave",
    "Lane": "Ln",
    "Boulevard": "Blvd",
    "Highway": "Hwy"
  };

  let shortened = name;
  
  // Apply abbreviations
  Object.keys(abbreviations).forEach(full => {
    const regex = new RegExp(`\\b${full}\\b`, 'gi');
    shortened = shortened.replace(regex, abbreviations[full]);
  });
  
  // Remove common words that can be implied
  shortened = shortened
    .replace(/\b(and|&|the|of|in|at|on|for)\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
  
  // Limit length if still too long
  if (shortened.length > 25) {
    shortened = shortened.substring(0, 22) + '...';
  }
  
  return shortened;
};

// ========================
// WARD AND COLONY FUNCTIONS
// ========================

// Function to generate ward list message (simplified to just numbers)
const generateWardList = () => {
  return `🏙️ *Ward Selection*\n\nPlease select your ward number (1-22):\n\n` +
    `Example: Type "5" for Ward-5\n\n` +
    `Reply with the *ward number* between 1-22`;
};

// Function to handle ward selection
const handleWardSelection = (phoneNumber, message, userState) => {
  const normalizedMsg = message.trim();
  
  if (!isNaN(normalizedMsg)) {
    const wardNumber = parseInt(normalizedMsg);
    if (wardNumber >= 1 && wardNumber <= 22) {
      const selectedWard = wardNumber.toString();
      userState.data.ward = `Ward-${selectedWard}`;
      userState.data.wardNumber = selectedWard;
      userState.step = 'urban_colony';
      userState.data.wardColonies = wardColonies[selectedWard];
      userState.data.currentPage = 1; // Reset page for colony selection
      return generateColonyList(selectedWard, 1);
    }
  }
  
  return generateInvalidWard();
};

// Function to generate invalid ward message
const generateInvalidWard = () => {
  return `⚠️ *Invalid Ward Selection*\n\n` +
    `Please select a ward number between 1-22\n\n` +
    `Example: Type "5" for Ward-5`;
};

// Function to generate colony list (special handling for large wards)
const generateColonyList = (wardNumber, page = 1) => {
  const colonies = wardColonies[wardNumber] || [];
  if (colonies.length === 0) {
    return `❌ *No Colonies Found*\n\nNo colonies found for Ward-${wardNumber}.\n\nPlease contact support.`;
  }
  
  // Special handling for wards with many colonies (9, 17, 18, 21)
  const largeWards = ["9", "17", "18", "21"];
  
  if (largeWards.includes(wardNumber)) {
    // Show all colonies on one page for large wards
    let message = `🏘️ *Ward-${wardNumber} Colonies* (${colonies.length} total)\n\n`;
    message += `Please select your colony:\n\n`;
    
    colonies.forEach((colony, index) => {
      // Shorten colony names aggressively for large wards
      let shortColony = colony;
      
      // Special shortening for specific large wards
      if (wardNumber === "9") {
        shortColony = colony
          .replace("Surya Nagar Ladhot Rd", "Surya Ngr Ladhot")
          .replace("Chhotu Ram Nagar", "Chhotu Ram Ngr")
          .replace("Kabir Colony", "Kabir Col")
          .replace("Parvesh Nagar", "Parvesh Ngr")
          .replace("Rajinder Nagar", "Rajinder Ngr")
          .replace("Sector 3,4,5,6", "Sec 3-6")
          .replace("Rishi Nagar Ext", "Rishi Ngr Ext")
          .replace("Shastri Nagar", "Shastri Ngr")
          .replace("Nagar", "Ngr")
          .replace("Colony", "Col");
      } else if (wardNumber === "17") {
        shortColony = colony
          .replace("HUDA Complex HSVP", "HUDA Cmp")
          .replace("Ramsukh Dass Colony", "Ramsukh Col")
          .replace("Vinay Nagar HUDA", "Vinay Ngr")
          .replace("Nagar", "Ngr")
          .replace("Colony", "Col")
          .replace("Mohalla", "Mhl");
      } else if (wardNumber === "18") {
        shortColony = colony
          .replace("New Aggarsain Colony", "New Aggarsain Col")
          .replace("New Janta Colony", "New Janta Col")
          .replace("Rajendra Colony", "Rajendra Col")
          .replace("Nagar", "Ngr")
          .replace("Colony", "Col");
      } else if (wardNumber === "21") {
        shortColony = colony
          .replace("Ambedkar Colony", "Ambedkar Col")
          .replace("Chhotu Ram Colony", "Chhotu Ram Col")
          .replace("Sheetal Nagar", "Sheetal Ngr")
          .replace("New Vijay Nagar", "New Vijay Ngr")
          .replace("Nagar", "Ngr")
          .replace("Colony", "Col");
      }
      
      // Limit length
      if (shortColony.length > 20) {
        shortColony = shortColony.substring(0, 17) + '...';
      }
      
      message += `${index + 1}. ${shortColony}\n`;
    });
    
    message += `\nReply with the *colony number*`;
    
    return message;
  }
  
  // For other wards, use pagination
  const itemsPerPage = 15;
  const totalPages = Math.ceil(colonies.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, colonies.length);
  const currentColonies = colonies.slice(startIndex, endIndex);
  
  let message = `🏘️ *Colony Selection for Ward-${wardNumber}* (Page ${page}/${totalPages})\n\n`;
  message += `Please select your colony:\n\n`;
  
  currentColonies.forEach((colony, index) => {
    const shortColony = shortenColonyName(colony);
    message += `${startIndex + index + 1}. ${shortColony}\n`;
  });
  
  message += `\n`;
  
  message += `\nReply with the *colony number*`;
  
  return message;
};

// Function to handle colony pagination
const handleColonyPagination = (phoneNumber, message, wardNumber, currentPage, userState) => {
  const normalizedMsg = message.trim().toLowerCase();
  const colonies = wardColonies[wardNumber] || [];
  
  // Special handling for large wards (no pagination)
  const largeWards = ["9", "17", "18", "21"];
  if (largeWards.includes(wardNumber)) {
    if (!isNaN(normalizedMsg)) {
      const colonyNumber = parseInt(normalizedMsg);
      if (colonyNumber >= 1 && colonyNumber <= colonies.length) {
        userState.data.colony = colonies[colonyNumber - 1];
        userState.step = 'landmark';
        return askForLandmark;
      }
    }
    
    return generateInvalidColony(wardNumber);
  }
  
  // For other wards, use pagination
  const itemsPerPage = 15;
  const totalPages = Math.ceil(colonies.length / itemsPerPage);
  
  if (normalizedMsg === 'next' && currentPage < totalPages) {
    userState.data.currentPage = currentPage + 1;
    return generateColonyList(wardNumber, currentPage + 1);
  } else if (normalizedMsg === 'prev' && currentPage > 1) {
    userState.data.currentPage = currentPage - 1;
    return generateColonyList(wardNumber, currentPage - 1);
  } else if (!isNaN(normalizedMsg)) {
    const colonyNumber = parseInt(normalizedMsg);
    if (colonyNumber >= 1 && colonyNumber <= colonies.length) {
      userState.data.colony = colonies[colonyNumber - 1];
      userState.step = 'landmark';
      return askForLandmark;
    }
  }
  
  return generateInvalidColony(wardNumber, currentPage);
};

// Function to generate invalid colony message
const generateInvalidColony = (wardNumber, currentPage = 1) => {
  const colonies = wardColonies[wardNumber] || [];
  
  // Special handling for large wards
  const largeWards = ["9", "17", "18", "21"];
  if (largeWards.includes(wardNumber)) {
    return `⚠️ *Invalid Selection*\n\n` +
      `Please select a colony number (1-${colonies.length})\n\n` +
      `Current ward: Ward-${wardNumber}`;
  }
  
  // For other wards
  const itemsPerPage = 15;
  const totalPages = Math.ceil(colonies.length / itemsPerPage);
  
  return `⚠️ *Invalid Selection*\n\n` +
    `Please select a colony number (1-${colonies.length})`;
};

// ========================
// RURAL AREA FUNCTIONS
// ========================

// Function to generate block list message
const generateBlockList = () => {
  return `🌄 *Block Selection*\n\nPlease select your block:\n\n` +
    blocks.map((block, idx) => `${idx + 1}. ${block}`).join("\n") +
    `\n\nReply with the *block number* (1-${blocks.length})`;
};

// Function to handle block selection
const handleBlockSelection = (phoneNumber, message, userState) => {
  const normalizedMsg = message.trim();
  
  if (!isNaN(normalizedMsg)) {
    const blockNumber = parseInt(normalizedMsg);
    if (blockNumber >= 1 && blockNumber <= blocks.length) {
      const selectedBlock = blocks[blockNumber - 1];
      userState.data.block = selectedBlock;
      userState.step = 'rural_village';
      userState.data.blockVillages = blockVillages[selectedBlock];
      return generateVillageList(selectedBlock);
    }
  }
  
  return generateInvalidBlock();
};

// Function to generate invalid block message
const generateInvalidBlock = () => {
  return `⚠️ *Invalid Block Selection*\n\n` +
    `Please select from these options (1-${blocks.length}):\n\n` +
    blocks.map((block, idx) => `${idx + 1}. ${block}`).join("\n") +
    `\n\nReply with number only (1-${blocks.length})`;
};

// Function to generate village list (all villages on one page with shortened names)
const generateVillageList = (block) => {
  const villages = blockVillages[block] || [];
  if (villages.length === 0) {
    return `❌ *No Villages Found*\n\nNo villages found for ${block}.\n\nPlease contact support.`;
  }
  
  let message = `🏡 *Village Selection for ${block} Block* (${villages.length} villages)\n\n`;
  message += `Please select your village:\n\n`;
  
  villages.forEach((village, index) => {
    // Use shortened village names to save space
    const shortVillage = shortenVillageName(village);
    message += `${index + 1}. ${shortVillage}\n`;
  });
  
  message += `\nReply with the *village number*`;
  
  return message;
};

// Function to handle village selection (no pagination needed)
const handleVillageSelection = (phoneNumber, message, block, userState) => {
  const normalizedMsg = message.trim();
  const villages = blockVillages[block] || [];
  
  if (!isNaN(normalizedMsg)) {
    const villageNumber = parseInt(normalizedMsg);
    if (villageNumber >= 1 && villageNumber <= villages.length) {
      userState.data.village = villages[villageNumber - 1];
      userState.step = 'landmark';
      return askForLandmark;
    }
  }
  
  return generateInvalidVillage(block);
};

// Function to generate invalid village message
const generateInvalidVillage = (block) => {
  const villages = blockVillages[block] || [];
  return `⚠️ *Invalid Selection*\n\n` +
    `Please select a village number (1-${villages.length})\n\n` +
    `Current block: ${block}`;
};

// ========================
// DEPARTMENT LIST - CATEGORIZED APPROACH
// ========================

// Function to generate category selection list
const generateDepartmentCategoryList = () => {
  const categories = departmentData.getAllCategories();
  
  let message = `🏢 *Department Categories*\n\n`;
  message += `Please select a category:\n\n`;
  
  categories.forEach(category => {
    message += `${category.id}. ${category.name} (${category.count} depts)\n`;
  });
  
  message += `\nReply with the *category number*`;
  
  return message;
};

// Function to generate department list for a specific category
const generateDepartmentListForCategory = (categoryId, page = 1) => {
  const category = departmentData.departmentCategories[categoryId];
  if (!category) return `❌ Invalid category selection`;
  
  const departments = departmentData.getDepartmentsByCategory(categoryId);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(departments.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, departments.length);
  const currentDepartments = departments.slice(startIndex, endIndex);
  
  let message = `🏢 ${category.name} (Page ${page}/${totalPages})\n\n`;
  
  currentDepartments.forEach((dept, index) => {
    message += `${startIndex + index + 1}. ${dept.department_name}\n`;
  });
  
  message += `\n`;
  
  message += `\nReply with the *department number*`;
  
  return message;
};

// Function to handle department selection with categories
const handleDepartmentSelection = (phoneNumber, message, userState) => {
  const normalizedMsg = message.trim();
  
  // If we're selecting a category (first step)
  if (!userState.data.selectedCategory) {
    if (departmentData.departmentCategories[normalizedMsg]) {
      userState.data.selectedCategory = normalizedMsg;
      userState.data.currentPage = 1;
      return generateDepartmentListForCategory(normalizedMsg, 1);
    } else {
      return `❌ Invalid category. Please select 1-9.\n\n` + generateDepartmentCategoryList();
    }
  }
  
  // If we're selecting a department from a category (second step)
  const departments = departmentData.getDepartmentsByCategory(userState.data.selectedCategory);
  const currentPage = userState.data.currentPage || 1;
  const itemsPerPage = 10;
  const totalPages = Math.ceil(departments.length / itemsPerPage);
  
  // Handle pagination
  const normalizedMsgLower = normalizedMsg.toLowerCase();
  if (normalizedMsgLower === 'next' && currentPage < totalPages) {
    userState.data.currentPage = currentPage + 1;
    return generateDepartmentListForCategory(userState.data.selectedCategory, currentPage + 1);
  } else if (normalizedMsgLower === 'prev' && currentPage > 1) {
    userState.data.currentPage = currentPage - 1;
    return generateDepartmentListForCategory(userState.data.selectedCategory, currentPage - 1);
  } 
  // Handle department selection
  else if (!isNaN(normalizedMsg)) {
    const deptNumber = parseInt(normalizedMsg);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const absoluteDeptNumber = startIndex + deptNumber;
    
    if (deptNumber >= 1 && deptNumber <= departments.length && absoluteDeptNumber <= departments.length) {
      const selectedDept = departments[absoluteDeptNumber - 1];
      userState.data.departmentId = selectedDept.department_id;
      userState.data.departmentName = selectedDept.department_name;
      userState.step = 'description';
      return askForDescription;
    }
  }
  
  return `❌ Invalid selection. Please choose a department number.`;
};

// Function to generate invalid category message
const generateInvalidCategory = () => {
  return `⚠️ *Invalid Category Selection*\n\n` +
    `Please select from these options (1-9):\n\n` +
    generateDepartmentCategoryList();
};

// ========================
// MAIN INTERFACE MESSAGES
// ========================
const welcomeMessage = `🏛️ *Welcome to Rohtak Grievance Redressal System*\n\nPlease choose an option:\n\n` +
  `1️⃣ *COMPLAINT* - File new grievance\n` +
  `2️⃣ *STATUS* - Check complaint status\n` +
  `3️⃣ *FAQ* - Frequently asked questions\n` +
  `4️⃣ *HELP* - Show help menu`;

const helpMessage = `🆘 *Help Guide*\n\nAvailable commands:\n\n` +
  `📌 *COMPLAINT* - Register new issue\n` +
  `📌 *STATUS <ticket-id>* - Track complaint\n` +
  `📌 *FAQ* - Common questions\n` +
  `📌 *HELP* - Show this menu\n\n` +
  `📌 *MENU* - Return to main menu`;

const mainMenu = `📋 *Main Menu*\n\n` +
  `1️⃣ File new complaint\n` +
  `2️⃣ Check status\n` +
  `3️⃣ View FAQs\n` +
  `4️⃣ Get help`;

// ========================
// USER REGISTRATION FLOW
// ========================
const askForName = `👤 *User Registration*\n\nPlease provide your:\n\n` +
  `📛 *Full Name* (as per ID proof)\n` +
  `Example: "Rahul Sharma"`;

const askForEmail = `📧 *Contact Information*\n\nPlease provide your:\n\n` +
  `✉️ *Email Address* (for updates)\n` +
  `Example: "user@example.com"`;

const invalidEmail = `❌ *Invalid Email Format*\n\n` +
  `Please provide a valid email address:\n` +
  `• Must contain @ symbol\n` +
  `• Must have domain (e.g., .com)\n` +
  `Example: "citizen@rohtak.gov.in"`;

const registrationComplete = `✅ *Registration Successful!*\n\n` +
  `Your details have been saved in our system.\n\n` +
  `Now let's file your complaint:`;

// ========================
// COMPLAINT FILING FLOW
// ========================
const askForDescription = `📝 *Complaint Details*\n\n` +
  `Please describe your issue *in detail*:\n\n` +
  `ℹ️ Include:\n` +
  `- Nature of problem\n` +
  `- Duration of issue\n` +
  `- Affected areas\n\n` +
  `Example: "Street light not working for 5 days near Sector 14 market"`;

const askForExactLocation = `📍 *Precise Location*\n\nPlease provide *exact location* details:\n\n` +
  `ℹ️ Include:\n` +
  `- House/Building number\n` +
  `- Nearby landmarks\n` +
  `- Any reference points\n\n` +
  `Example: "House No. 45, Opposite HDFC Bank, Main Road"`;

const complaintConfirmation = (department, description, location) =>
  `🔍 *Complaint Verification*\n\n` +
  `Please confirm your complaint details:\n\n` +
  `🏢 *Department*: ${department}\n` +
  `📝 *Issue*: ${description}\n` +
  `📍 *Location*: ${location}\n\n` +
  `Reply with:\n` +
  `1️⃣ *YES* - To submit complaint\n` +
  `2️⃣ *NO* - To start over`;

const complaintRegistered = (ticketId, department, location) =>
  `✅ *Complaint Registered!*\n\n` +
  `📄 Ticket ID: *${ticketId}*\n` +
  `🏢 Department: *${department}*\n` +
  `📍 Location: *${location}*\n\n` +
  `🔔 You will receive updates on this number.\n` +
  `📌 To check status, send:\n"*STATUS ${ticketId}*"`;

const complaintCancelled = `❌ *Complaint Cancelled*\n\n` +
  `The complaint process has been terminated.\n\n` +
  `To start over, send:\n*COMPLAINT*`;

// ========================
// STATUS CHECK FLOW
// ========================
const askForTicketId = `🔎 *Check Complaint Status*\n\n` +
  `Please enter your *RTK Ticket ID* (Example: RTK-J82TXM):\n\n` +
  `📍 *Where to find your Ticket ID:*\n` +
  `- In your complaint confirmation message\n` +
  `- In any status update from us\n\n` +
  `📌 Type "MENU" to return to main menu`;

const statusUpdate = (ticketId, status, department, notes, officer) => {
  const base = `📢 *Status Update*\n\nTicket: #${ticketId}\nDepartment: ${department}\n`;
  const statusMessages = {
    'Pending': `${base}Status: ⏳ Pending\n\nWe've received your complaint.`,
    'In Progress': `${base}Status: 🛠️ In Progress\n\nOfficer: ${officer}\n\n${notes || ''}`,
    'Resolved': `${base}Status: ✅ Resolved\n\nResolution: ${notes || 'Completed'}`,
    'Rejected': `${base}Status: ❌ Rejected\n\nReason: ${notes || 'Not specified'}`
  };
  return statusMessages[status] || `${base}Status changed to: ${status}`;
};

const statusNotFound = (ticketId) =>
  `❌ *Complaint Not Found*\n\n` +
  `We couldn't find complaint with ID: *${ticketId}*\n\n` +
  `ℹ️ *Possible reasons:*\n` +
  `• Typo in Ticket ID (correct format: RTK-XXXXXX)\n` +
  `• Complaint filed more than 6 months ago\n` +
  `• Technical error (rare)\n\n` +
  `🔄 *What would you like to do?*\n\n` +
  `1. Try again with correct ID\n` +
  `2. Contact support at support@rohtak.gov.in\n` +
  `3. Return to main menu`;

const invalidTicketFormat = `⚠️ *Invalid Ticket Format*\n\n` +
  `Rohtak Ticket IDs follow this format:\n\n` +
  `• Starts with "RTK-"\n` +
  `• Followed by 6 characters (letters/numbers)\n` +
  `• Example: "RTK-J82TXM"\n\n` +
  `Please check your confirmation message and try again\n\n` +
  `📌 Type "MENU" to cancel`;

// ========================
// FAQ SECTION
// ========================
const faqResponse = `❓ *Frequently Asked Questions*\n\n` +
  `Q: How long for resolution?\n` +
  `A: 3-7 working days (varies by department)\n\n` +
  `Q: Can officers contact me?\n` +
  `A: Yes, via your registered WhatsApp number\n\n` +
  `Q: Wrong department selected?\n` +
  `A: Email grievance@rohtak.gov.in with ticket ID\n\n` +
  `Q: Emergency complaints?\n` +
  `A: Call 1077 for immediate assistance\n\n` +
  `Q: How to check status?\n` +
  `A: Send "STATUS <your-ticket-id>"`;

// ========================
// SYSTEM MESSAGES
// ========================
const errorMessage = `⚠️ *System Error*\n\n` +
  `We're experiencing technical difficulties.\n` +
  `Please try again later or contact support:\n` +
  `📞 1800-123-4567\n` +
  `✉️ support@rohtak.gov.in`;

const sessionTimeout = `⏱️ *Session Expired*\n\n` +
  `Your previous session has timed out.\n\n` +
  `Please start again by sending:\n*COMPLAINT*`;

const invalidOption = `❌ *Invalid Option*\n\n` +
  `Please select from the available options.\n\n` +
  `📌 Send "HELP" for guidance\n` +
  `📌 Send "MENU" for main menu`;

// ========================
// AREA FLOW (UPDATED FOR WARD/COLONY AND BLOCK/VILLAGE)
// ========================
const askForAreaType = `📍 *Area Type*\n\nPlease select your area type:\n\n` +
  `1️⃣ Urban (Municipal Corporation area)\n` +
  `2️⃣ Rural (Village area)\n\n` +
  `Reply with *1* or *2*`;

const askForLandmark = `🗺️ *Final Location Details*\n\nPlease provide:\n\n` +
  `📍 Nearby landmark or house details\n` +
  `Example: "Near Hanuman Temple" or "House No. 123"`;

const invalidAreaSelection = `⚠️ *Invalid Selection*\n\n` +
  `Please choose from the provided options only\n\n` +
  `📌 Type "MENU" to cancel registration`;

// ========================
// MODULE EXPORTS
// ========================
module.exports = {
  // WARD AND COLONY FUNCTIONS
  generateWardList,
  generateInvalidWard,
  generateColonyList,
  generateInvalidColony,
  handleWardSelection,
  handleColonyPagination,
  wards,
  wardColonies,

  // RURAL AREA FUNCTIONS
  generateBlockList,
  generateInvalidBlock,
  generateVillageList,
  generateInvalidVillage,
  handleBlockSelection,
  handleVillageSelection, // Updated to handle village selection without pagination
  blocks,
  blockVillages,

  // DEPARTMENT FUNCTIONS
  generateDepartmentCategoryList,
  generateDepartmentListForCategory,
  handleDepartmentSelection,
  generateInvalidCategory,

  // MAIN INTERFACE MESSAGES
  welcomeMessage,
  helpMessage,
  mainMenu,

  // USER REGISTRATION FLOW
  askForName,
  askForEmail,
  invalidEmail,
  registrationComplete,

  // COMPLAINT FILING FLOW
  askForDescription,
  askForExactLocation,
  complaintConfirmation,
  complaintRegistered,
  complaintCancelled,

  // STATUS CHECK FLOW
  askForTicketId,
  statusUpdate,
  statusNotFound,
  invalidTicketFormat,

  // FAQ SECTION
  faqResponse,

  // SYSTEM MESSAGES
  errorMessage,
  sessionTimeout,
  invalidOption,

  // AREA FLOW
  askForAreaType,
  askForLandmark,
  invalidAreaSelection,
  
  // Helper functions
  shortenVillageName
};