import { db } from './firebaseConfig.js';
import { collection, addDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js';

// Logout function
document.getElementById('logoutButton').addEventListener('click', () => {

  sessionStorage.clear();
  window.location.href = 'index.html';
});


// Ensure the page is accessible only after login
document.addEventListener('DOMContentLoaded', () => {
  const user = JSON.parse(sessionStorage.getItem('user'));
  if (!user || user.role !== 'student') {
    alert('Unauthorized access. Please log in.');
    window.location.href = 'index.html';
    return;
  }

  // Display user's name and department on the page
  document.getElementById('userName').textContent = `Welcome, ${user.Name}`;
  document.getElementById('userDepartment').textContent = `Department: ${user.Department}`;

  // Add user's department as an option in the domain dropdown
  const domainDropdown = document.getElementById('domain');
  const deptOption = document.createElement('option');
  deptOption.value = user.Department;
  deptOption.textContent = user.Department;
  domainDropdown.appendChild(deptOption);
});

// Handle form submission
document.getElementById('complaintForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  // Get form values
  const domain = document.getElementById('domain').value;
  const subject = document.getElementById('subject').value;
  const description = document.getElementById('description').value;

  // Reference to the complaints collection
  const complaintsRef = collection(db, 'complaints');

  try {
    // Add the complaint document to Firestore
    await addDoc(complaintsRef, {
      domain: domain,
      subject: subject,
      description: description,
      createdTimestamp: serverTimestamp(), // Automatically generated timestamp
      resolvedTimestamp: null,             // Initially null
      status: 'Not Solved',                // Default status
    });

    alert('Complaint submitted successfully!');
    // Clear the form after submission
    document.getElementById('complaintForm').reset();
  } catch (error) {
    console.error('Error submitting complaint:', error);
    alert('An error occurred while submitting the complaint. Please try again.');
  }
});