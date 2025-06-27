const formPost = document.getElementById("postForm");
<script src="https://cdnjs.cloudflare.com/ajax/libs/dompurify/3.2.6/purify.min.js" integrity="sha512-YlctBG9PGZIhh9keoqI3eZkQM9T8QUbiBi7qNYAO/TUEo8jqWX5pLp5+x1cKRQDRzJ/lyGyJ9WUVNIRduxIIFw==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>


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
               <p>${DOMPurify.sanitize(p.content)}</p>
          <small class="text-gray-500">${new Date(p.createdAt).toLocaleString()}</small>
        </div>`
    )
    .join("");
}


loadPosts();
