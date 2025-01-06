import { db } from './firebaseConfig.js';
import { collection, query, where, getDocs, doc, updateDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js';

// Logout
document.getElementById('logoutButton').addEventListener('click', () => {
  sessionStorage.clear();
  window.location.href = 'index.html';
});

// Ensure only professors can access
document.addEventListener('DOMContentLoaded', async () => {
  const user = JSON.parse(sessionStorage.getItem('user'));
  console.log('Session user data:', user); // Debugging step

  if (!user || user.role !== 'professor') {
    alert('Unauthorized access. Please log in.');
    window.location.href = 'index.html';
    return;
  }

  const professorDomain = user.Department;

  if (!professorDomain) {
    alert('Error: Department not found in session. Please log in again.');
    window.location.href = 'index.html';
    return;
  }

  try {
    const complaintsRef = collection(db, 'complaints');
    const q = query(complaintsRef, where('domain', '==', professorDomain));
    const querySnapshot = await getDocs(q);

    const tableBody = document.querySelector('#complaintsTable tbody');
    querySnapshot.forEach((doc) => {
      const complaint = doc.data();
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${complaint.subject}</td>
        <td>${complaint.description}</td>
        <td>${complaint.status}</td>
        <td>
          <button onclick="resolveComplaint('${doc.id}')">Resolve</button>
        </td>
      `;
      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error('Error fetching complaints:', error);
  }
});



// Mark complaint as resolved
window.resolveComplaint = async (complaintId) => {
  try {
    const complaintRef = doc(db, 'complaints', complaintId);
    await updateDoc(complaintRef, {
      status: 'Resolved',
      resolvedTimestamp: serverTimestamp(),
    });
    alert('Complaint resolved successfully!');
    window.location.reload(); // Refresh the dashboard
  } catch (error) {
    console.error('Error resolving complaint:', error);
    alert('An error occurred. Please try again.');
  }
};
