if (!global.repeatIntervals) global.repeatIntervals = new Map();

module.exports.config = {
  name: "تكرار",
  version: "1.0.2",
  hasPermission: 2,
  credits: "SAI",
  description: "تكرار اسم المجموعة باستمرار",
  commandCategory: "نظام",
  usages: "[تشغيل/ايقاف] [الاسم]",
  cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
  const threadID = event.threadID;
  const senderID = event.senderID;

  const botAdmins = [
    ...(global.config.ADMINBOT || []),
    ...(global.config.OPERATOR || []),
    ...(global.config.OWNER || [])
  ].map(String);

  if (!botAdmins.includes(String(senderID))) {
    return api.sendMessage("❌ هذا الأمر خاص بإدارة البوت فقط.", threadID);
  }

  const action = args[0];

  if (action === "تشغيل") {
    if (global.repeatIntervals.has(threadID)) {
      return api.sendMessage("⚠️ التكرار مفعل بالفعل في هذه المجموعة.", threadID);
    }

    let currentName;
    try {
      const info = await api.getThreadInfo(threadID);
      currentName = info.threadName;
    } catch (e) {
      return api.sendMessage("❌ تعذر جلب اسم المجموعة الحالي.", threadID);
    }

    if (!currentName) {
      return api.sendMessage("❌ لا يوجد اسم للمجموعة حالياً.", threadID);
    }

    const interval = setInterval(async () => {
      try {
        await api.setTitle(currentName, threadID);
      } catch (e) {}
    }, 3000);

    global.repeatIntervals.set(threadID, interval);
    return api.sendMessage(`🔁 تم تفعيل التكرار!\nسيتم تكرار الاسم:\n"${currentName}" باستمرار.`, threadID);
  }

  else if (action === "ايقاف") {
    if (!global.repeatIntervals.has(threadID)) {
      return api.sendMessage("⚠️ التكرار غير مفعل في هذه المجموعة.", threadID);
    }
    clearInterval(global.repeatIntervals.get(threadID));
    global.repeatIntervals.delete(threadID);
    return api.sendMessage("✅ تم إيقاف التكرار بنجاح.", threadID);
  }

  else {
    return api.sendMessage(
      "📌 طريقة الاستخدام:\n" +
      "• تكرار تشغيل — يجلب الاسم الحالي ويكرره باستمرار\n" +
      "• تكرار ايقاف — لإيقاف التكرار",
      threadID
    );
  }
};
