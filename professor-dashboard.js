import { db } from './firebaseConfig.js';
import { collection, query, where, getDocs, doc, updateDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js';

// Reusable function for redirects
function redirectToLogin(message) {
  alert(message);
  window.location.href = 'index.html';
}

// HTML escaping function to prevent XSS
function escapeHTML(str) {
  return str.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

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
    redirectToLogin('Unauthorized access. Please log in.');
    return;
  }

  const professorDomain = user.Department;

  if (!professorDomain) {
    redirectToLogin('Error: Department not found in session. Please log in again.');
    return;
  }

  try {
    const complaintsRef = collection(db, 'complaints');
    const q = query(complaintsRef, where('domain', '==', professorDomain));
    const querySnapshot = await getDocs(q);

    const tableBody = document.querySelector('#complaintsTable tbody');
    tableBody.innerHTML = ''; // Clear existing rows

    querySnapshot.forEach((doc) => {
      const complaint = doc.data();
      const row = document.createElement('tr');
      row.id = `row-${doc.id}`; // Add a unique ID to the row

      // Check if the complaint is resolved
      const isResolved = complaint.status === 'Resolved';

      row.innerHTML = `
        <td>${escapeHTML(complaint.subject)}</td>
        <td>${escapeHTML(complaint.description)}</td>
        <td class="status">${escapeHTML(complaint.status)}</td>
        <td>
          <button 
            onclick="resolveComplaint('${doc.id}')" 
            id="button-${doc.id}" 
            ${isResolved ? 'disabled' : ''}>
            ${isResolved ? 'Resolved' : 'Resolve'}
          </button>
        </td>
      `;
      tableBody.appendChild(row);
    });

    if (querySnapshot.empty) {
      tableBody.innerHTML = `<tr><td colspan="4">No complaints found for your department.</td></tr>`;
    }
  } catch (error) {
    console.error('Error fetching complaints:', error);
    alert('An error occurred while fetching complaints. Please try again later.');
  }
});

// Mark complaint as resolved
window.resolveComplaint = async (complaintId) => {
  if (!complaintId) {
    alert('Invalid complaint ID. Please try again.');
    return;
  }

  try {
    const complaintRef = doc(db, 'complaints', complaintId);
    await updateDoc(complaintRef, {
      status: 'Resolved',
      resolvedTimestamp: serverTimestamp(),
    });

    // Update the specific row dynamically without reloading
    const statusCell = document.querySelector(`#row-${complaintId} .status`);
    const button = document.querySelector(`#button-${complaintId}`);

    if (statusCell) statusCell.textContent = 'Resolved';
    if (button) {
      button.textContent = 'Resolved';
      button.disabled = true; // Disable the button
    }

    alert('Complaint resolved successfully!');
  } catch (error) {
    console.error('Error resolving complaint:', error);
    alert('An error occurred while resolving the complaint. Please try again later.');
  }
};
