/**
 * Process help command.
 *
 * @param {Message} message
 * @return {Promise<void>}
 */
const procCommand = async (message) => {
  let output = '*רשימת פקודות לבוט:*' + '\n';
  output += 'ו--------------------------------ו' + '\n';
  output += '*פקודות קורונה*' + '\n';
  output += ' ● !קורונה' + '\n';
  output += ' ● !קורונה <ישוב>' + '\n';
  output += ' ● !קורונה <מדינה>' + '\n';
  output += 'ו--------------------------------ו' + '\n';
  output += '*יוצר סטיקרים*' + '\n';
  output += ' ● !סטיקר- הופך תמונה/סרטון/גיף לסטיקר' + '\n';
  output += 'ו--------------------------------ו' + '\n';
  output += '*פקודות כיף*' + '\n';
  output += ' ● !חתולי' + '\n';
  output += ' ● !כלב' + '\n';
  output += ' ● !ברווז' + '\n';
  output += ' ● !שועל' + '\n';
  output += ' ● !לטאה' + '\n';
  output += ' ● !דוגייי' + '\n';
  output += ' ● !חזיר' + '\n';
  output += ' ● !מספר <n> <n>' + '\n';
  output += ' ● !שם' + '\n';
  output += ' ● !גימטריה <ערך>' + '\n';
  output += ' ● !מזל- משפטים של עוגיית מזל' + '\n';
  output += ' ● !טיפ- נותן טיפ' + '\n';
  output += ' ● !אהבה- מחשבון אהבה' + '\n';
  output += ' ● !שיבוץ- תפקיד בצופים' + '\n';
  output += 'ו--------------------------------ו' + '\n';
  output += '*פקודות שמגיבים להודעה*' + '\n';
  output += ' ● !ניתוח - מנתח את הרגשות בהודעה' + '\n';
  output += ' ● !תרגם- מתרגם לעברית' + '\n';
  output += 'ו--------------------------------ו' + '\n';
  output += '*אחר*' + '\n';
  output += ' ● !מיזה <טלפון>' + '\n';
  output += ' ● !ויקי <ערך>' + '\n';
  output += ' ● !ויקי <מספר> <ערך>' + '\n';
  output += ' ● !פירוש <מילה>' + '\n';
  output += ' ● !שידורים <ערוץ> <מתי>' + '\n';
  output += ' ● !מבזק <מספר>' + '\n';
  output += ' ● !תרגם <טקסט>' + '\n';
  output += ' ● !אזעקה <יישוב>' + '\n';
  output += ' ● !עזרה' + '\n';
  output += 'ו--------------------------------ו' + '\n';
  output += '*כלי עזר*' + '\n';
  output += ' ● !תחזית ' + '<עיר>' + '\n';
  output += ' ● !עצלן- תמלול הקלטה' + '\n';
  output += ' ● !סקר- יוצר סקרים לווטסאפ' + '\n';
  output += 'ו--------------------------------ו' + '\n';
  output += '*פקודות תמונה*' + '\n';
  output += ' ● !דומה- מוצא דמיון בפנים של שני אנשים' + '\n';
  output += ' ● !ניתוח- נותן מידע על פרצופים בתמונה' + '\n';
  output += ' ● !צבע- צובע תמונות בשחור לבן' + '\n';

  await message.reply(output);
};
module.exports = procCommand;