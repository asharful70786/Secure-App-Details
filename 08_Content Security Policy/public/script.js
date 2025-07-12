const formPost = document.getElementById("postForm");

formPost.addEventListener("submit", async (e) => {
  e.preventDefault();
  const content = document.getElementById("content").value;
  if (!content.trim()) return;
  await fetch("/posts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content }),
  });
  document.getElementById("content").value = "";
  loadPosts();
});

async function loadPosts() {
  const response = await fetch("/posts");
  const posts = await response.json();
  const postsDiv = document.getElementById("posts");
  postsDiv.innerHTML = posts
    .map(
      (p) => `
        <div class="bg-white p-4 mb-2 rounded shadow">
          <p>${p.content}</p>
          <small class="text-gray-500">${new Date(p.createdAt).toLocaleString()}</small>
        </div>`
    )
    .join("");
}

loadPosts();


console.clear();

console.log("%cHold Up!", "color: blue; font-size: 48px; font-weight: bold; text-shadow: 2px 2px black;");
console.log("%cIf someone told you to copy/paste something here you have an 11/10 chance you're being scammed.",
  "color: white; font-size: 16px; font-weight: bold; background: black;");
console.log("%cPasting anything in here could give attackers access to your account.",
  "color: red; font-size: 18px; font-weight: bold;");
console.log("%cUnless you understand exactly what you are doing, close this window and stay safe.",
  "color: gray; font-size: 14px;");
