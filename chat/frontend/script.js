let userMessages = [];
let assistantMessages = [];

async function fetchFortuneChat(message) {
  console.log("script user msg : " + userMessages);
  console.log("script assis msg : " + assistantMessages);

  try {
    const response = await fetch("http://localhost:3000/fortunechat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userMessages: userMessages,
        assistantMessages: assistantMessages,
      }),
    });

    if (!response.ok) throw new Error(`Error: ${response.status}`);

    const data = await response.json();
    addMessageToChat(`${data}`, "fortune");
  } catch (error) {
    console.error("Fetching error:", error);
    addMessageToChat("오류가 발생했습니다. 나중에 다시 시도해주세요.", "error");
  }
}

function sendMessage() {
  // 사용자의 입력 메시지 가져옴
  const input = document.getElementById("messageInput");
  const message = input.value.trim();
  if (message) {
    // 채팅 메시지 추가 함수로 메시지 보내고
    addMessageToChat(message, "user");
    // userMessage 배열에 사용자 메시지 저장
    userMessages.push(message);
    // post로 api연동을 위해 fetch 함수로 메시지 보냄
    fetchFortuneChat(message);

    input.value = ""; // 입력 필드 초기화
  }
}

function addMessageToChat(message, type) {
  const chat = document.getElementById("chat");

  // 메시지 타입이 운세일 경우 프로필 정보가 포함될 컨테이너 생성
  if (type === "fortune") {
    const profileContainer = document.createElement("div");
    profileContainer.className = "fortune-profile-outer";

    const profileImage = document.createElement("img");
    profileImage.className = "profile-image";
    profileImage.src = "./asset/img/profile_img_kyumy.jpg"; // 프로필 이미지 경로
    profileImage.alt = "운세 알려주는 정겨미";

    const profileName = document.createElement("div");
    profileName.className = "profile-name";
    profileName.textContent = "운세 알려주는 정겨미";

    profileContainer.appendChild(profileImage);
    profileContainer.appendChild(profileName);

    // 프로필 컨테이너를 chat 컨테이너에 추가
    chat.appendChild(profileContainer);

    // assistantMessage 배열에 운세 메시지 저장
    assistantMessages.push(message);
  }

  const messageContainer = document.createElement("div");
  messageContainer.className = "message " + type + "-message";

  const messageContent = document.createElement("div");
  messageContent.className = "message-content";
  messageContent.textContent = message;
  messageContainer.appendChild(messageContent);

  // 메시지 컨테이너를 chat 컨테이너에 추가
  chat.appendChild(messageContainer);
  chat.scrollTop = chat.scrollHeight;
}

document
  .getElementById("messageInput")
  .addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault(); // 폼이 제출되는 것을 방지
      sendMessage(); // 메시지 전송 함수 호출
    }
  });
