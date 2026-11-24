
async function analyze(){
  let link = document.getElementById('link').value.trim();
  let question = document.getElementById('question').value.trim();
  let answer = document.getElementById('answer');
  let imageInput = document.getElementById('imageInput');
  let file = imageInput ? imageInput.files[0] : null;

  if (!link && !question && !file) {
    answer.innerText = "पहले सवाल, लिंक या फोटो चुनो।";
    return;
  }

  if (file && !file.type.startsWith("image/")) {
    answer.innerText = "कृपया सही फोटो चुनो।";
    return;
  }

  if (file && file.size > 5 * 1024 * 1024) {
    answer.innerText = "फोटो 5 MB से छोटी चुनो।";
    return;
  }

  answer.innerText = "PYARE AI फोटो और सवाल पढ़ रहा है...";

  try {
    let imageBase64 = "";
    let mimeType = "";

    if (file) {
      mimeType = file.type;
      imageBase64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(",")[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    }

    let response = await fetch('/api/chat', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({
        link,
        question,
        imageBase64,
        mimeType
      })
    });

    let data = await response.json();
    answer.innerText = data.answer || data.error || "कोई जवाब नहीं मिला।";

  } catch(e) {
    answer.innerText = "फोटो भेजने में समस्या हुई। दोबारा कोशिश करो।";
  }
}
