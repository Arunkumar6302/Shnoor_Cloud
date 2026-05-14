const mongoose = require('mongoose');
require('dotenv').config();

const testConnection = async () => {
  try {
    console.log('Testing connection to MongoDB Atlas...');
    const uri = 'mongodb+srv://Arun_507:Arun_6302@cluster0.xfzfuu6.mongodb.net/shnoor?retryWrites=true&w=majority&appName=Cluster0';
    
    await mongoose.connect(uri);
    console.log('✅ SUCCESS: Connected to MongoDB Atlas successfully!');
    
    const dbName = mongoose.connection.name;
    console.log(`📡 Database name: ${dbName}`);
    
    await mongoose.connection.close();
    console.log('Connection closed.');
    process.exit(0);
  } catch (err) {
    console.error('❌ FAILURE: Could not connect to MongoDB Atlas.');
    console.error('Error details:', err.message);
    process.exit(1);
  }
};

testConnection();
