// Player names supplied from the IPL 2023-2026 squad lists.
const defaultImage = 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=500&auto=format&fit=crop&q=80';
const names = [
  'Ambati Rayudu', 'Subhranshu Senapati', 'Rajvardhan Hangargekar', 'Dwaine Pretorius', 'Prashant Solanki', 'Shaik Rasheed', 'Nishant Sindhu', 'Sisanda Magala', 'Ajay Mandal', 'Bhagath Varma',
  'Prithvi Shaw', 'Ripal Patel', 'Rovman Powell', 'Sarfaraz Khan', 'Yash Dhull', 'Lalit Yadav', 'Chetan Sakariya', 'Kamlesh Nagarkoti', 'Lungi Ngidi', 'Aman Khan', 'Praveen Dubey', 'Vicky Ostwal', 'Rilee Rossouw', 'Ishant Sharma',
  'Shivam Mavi', 'Joshua Little', 'Abhinav Manohar', 'Alzarri Joseph', 'Matthew Wade', 'Kane Williamson', 'Jayant Yadav', 'Vijay Shankar', 'Srikar Bharat', 'Odean Smith', 'Urvil Patel', 'Pradeep Sangwan', 'Darshan Nalkande',
  'Shreyas Iyer', 'Lockie Ferguson', 'Tim Southee', 'Shakib Al Hasan', 'David Wiese', 'Narayan Jagadeeshan', 'Mandeep Singh', 'Liton Das', 'Rahmanullah Gurbaz', 'Kulwant Khejroliya', 'Anukul Roy',
  'KL Rahul', 'Krishnappa Gowtham', 'Daniel Sams', 'Kyle Mayers', 'Amit Mishra', 'Naveen-ul-Haq', 'Jaydev Unadkat', 'Yash Thakur', 'Manan Vohra', 'Yudhvir Charak', 'Prerak Mankad', 'Karan Sharma', 'Swapnil Singh',
  'Jofra Archer', 'Dewald Brevis', 'Jhye Richardson', 'Jason Behrendorff', 'Arjun Tendulkar', 'Ramandeep Singh', 'Mohd. Arshad Khan', 'Kumar Kartikeya Singh', 'Hrithik Shokeen', 'Akash Madhwal', 'Vishnu Vinod', 'Raghav Goyal', 'Duan Jansen', 'Shams Mulani', 'Nehal Wadhera',
  'Harpreet Brar', 'Raj Bawa', 'Nathan Ellis', 'Rishi Dhawan', 'Bhanuka Rajapaksa', 'Sikandar Raza', 'Harpreet Singh Bhatia', 'Baltej Singh', 'Atharva Taide', 'Vidwath Kaverappa', 'Mohit Rathee', 'Shivam Singh',
  'Prasidh Krishna', 'Shimron Hetmyer', 'Ravichandran Ashwin', 'Navdeep Saini', 'Joe Root', 'Obed McCoy', 'Donavon Ferreira', 'KC Cariappa', 'KM Asif', 'Kuldeep Sen', 'Kuldip Yadav', 'Kunal Singh Rathore', 'Murugan Ashwin', 'Akash Vashist', 'Abdul Basith',
  'Michael Bracewell', 'David Willey', 'Reece Topley', 'Mahipal Lomror', 'Finn Allen', 'Siddarth Kaul', 'Rajan Kumar', 'Avinash Singh', 'Karn Sharma', 'Suyash Prabhudessai', 'Sonu Yadav', 'Manoj Bhandage', 'Himanshu Sharma', 'Akash Deep',
  'Rahul Tripathi', 'Mayank Dagar', 'Glenn Phillips', 'Akeal Hosein', 'Vivrant Sharma', 'Adil Rashid', 'Upendra Yadav', 'Sanvir Singh', 'Samarth Vyas',
  'Aravelly Avanish', 'Rachin Ravindra', 'Daryl Mitchell', 'Sameer Rizvi', 'Richard Gleeson', 'Saurav Chauhan', 'Tom Curran', 'Will Jacks', 'Alzarri Joseph', 'Vyshak Vijaykumar', 'Shai Hope', 'Ricky Bhui', 'Abishek Porel', 'Kumar Kushagra', 'Swastik Chhikara', 'Sumit Kumar', 'Gulbadin Naib', 'Rasikh Dar Salam', 'Lizaad Williams',
  'Angkrish Raghuvanshi', 'Kona Srikar Bharat', 'Sherfane Rutherford', 'Mitchell Starc', 'Sakib Hussain', 'Dushmantha Chameera', 'Mujeeb Ur Rahman', 'Allah Mohammad Ghazanfar', 'Anmolpreet Singh', 'Jhatavedh Subramanyan', 'Akash Singh', 'Vijayakanth Viyaskanth', 'Shubham Dubey', 'Donovan Ferreira', 'Tom Kohler-Cadmore', 'Tanush Kotian', 'Nandre Burger', 'Abid Mushtaq', 'Ashton Turner', 'Arshin Kulkarni', 'Shamar Joseph', 'M. Siddharth', 'Matt Henry', 'Gurnoor Singh Brar', 'Manav Suthar', 'BR Sharath', 'Robin Minz', 'Azmatullah Omarzai', 'Sandeep Warrier', 'Sushant Mishra', 'Naman Dhir', 'Surya Kumar Yadav', 'Shivalik Sharma', 'Harvik Desai', 'Mohammad Nabi', 'Shreyas Gopal', 'Gerald Coetzee', 'Luke Wood', 'Nuwan Thushara', 'Anshul Kamboj', 'Dilshan Madushanka', 'Kwena Maphaka', 'Luvnith Sisodia', 'Shivam Shukla', 'Blessing Muzarabani', 'Lungisani Ngidi', 'Tim Seifert', 'Jacob Bethell', 'Abhinandan Singh', 'Nuwan Thushara', 'Tim David', 'Aaron Hardie', 'Mitchell Owen', 'Xavier Bartlett', 'Kyle Jamieson', 'Lhuan-dre Pretorius', 'Vaibhav Sooryavanshi', 'Ashok Sharma', 'Aniket Verma', 'Sachin Baby', 'Smaran-R', 'Wiaan Mulder', 'Kamindu Mendis', 'Harsh Dubey', 'Zeeshan Ansari', 'Eshan Malinga', 'Karun Nair', 'Sediqullah Atal', 'Vipraj Nigam', 'Madhav Tiwari', 'Manvanth Kumar', 'Tripurana Vijay', 'T. Natarajan', 'Himmat Singh', 'Matthew Breetzke', 'Aryan Juyal', 'Yuvraj Chaudhary', 'Digvesh Singh Rathi', 'Prince Yadav', 'George Linde', 'Naman Tiwari', 'Kanishk Chouhan', 'Jordan Cox', 'Vihaan Malhotra', 'Mangesh Yadav', 'Jacob Duffy', 'Satvik Deswal', 'Salil Arora', 'Shivang Kumar', 'RS Ambrish', 'David Payne', 'Brydon Carse', 'Amit Kumar', 'Praful Hinge', 'Krains Fuletra', 'Onkar Tukaram Tarmale', 'Danish Malewar', 'Ruchit Ahir', 'Mayank Rawat', 'Atharva Ankolekar', 'Krish Bhagat', 'Mohammed Salahuddin Izhar', 'Tejasvi Dahiya', 'Sarthak Ranjan', 'Daksh Kamra', 'Saurabh Dubey', 'Ravi Singh', 'Aman Rao Perala', 'Brijesh Sharma', 'Adam Milne', 'Yash Raj Punja', 'Emanjot Singh Chahal', 'Sanju Samson', 'Cooper Connolly', 'Ben Dwarshuis', 'Vishal Nishad', 'Tom Banton', 'Connor Esterhuizen', 'Karim Janat', 'Kuldip Yadav', 'Macneil Noronha', 'Dian Forrester', 'Akeal Hosein', 'Zakary Foulkes', 'Gurjapneet Singh', 'Matthew Short', 'Prashant Veer', 'Ramakrishna Ghosh', 'Aman Hakim Khan', 'Richard Gleeson', 'Vignesh Puthur', 'Ashwani Kumar', 'Raghu Sharma', 'Sahil Parakh', 'Ben Duckett', 'Auqib Nabi Dar', 'Rehan Ahmed', 'Shahbaz Ahamad', 'Mukul Choudhary', 'Akshat Raghuwanshi', 'Josh Inglis', 'Naman Tiwari', 'Shamar Joseph', 'William O\'Rourke', 'Pathum Nissanka', 'Lungisani Ngidi', 'Mujeeb Ur Rahman', 'Keshav Maharaj', 'Ruchit Ahir', 'Mohammed Salahuddin Izhar'
];

export const IPL_SQUAD_PLAYERS = [...new Set(names)].map((name, index) => ({
  id: `squad-${String(index + 1).padStart(3, '0')}`,
  name,
  role: 'All-Rounder',
  nationality: 'India',
  isOverseas: false,
  basePrice: 75,
  imageURL: defaultImage,
  seasons: [2023, 2024, 2025, 2026],
  stats: {
    matches: 0,
    runs: 0,
    strikeRate: 0,
    wickets: 0,
    economy: 0,
    specialty: 'IPL squad player (2023-2026)'
  }
}));
