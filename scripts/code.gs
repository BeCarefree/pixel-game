/**
 * Google Apps Script for Pixel Quiz Game
 */

const SHEET_QUESTIONS = "題目";
const SHEET_ANSWERS = "回答";

function doGet(e) {
  return handleRequest(e);
}

function doPost(e) {
  return handleRequest(e);
}

function handleRequest(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);
  
  try {
    const params = e.parameter || {};
    let postData = {};
    
    // Robust JSON parsing
    if (e.postData && e.postData.contents) {
      try {
        postData = JSON.parse(e.postData.contents);
      } catch (err) {
        // failed to parse, maybe it isn't JSON
        console.warn("JSON Parse Error", err);
        postData = params; 
      }
    } else {
        postData = params;
    }

    // Determine Action
    // Prioritize postData action, then param action
    const action = postData.action || params.action;

    // Route Actions
    if (action === 'getQuestions') {
       const count = postData.count || params.count || 5;
       return responseJSON(getRandomQuestions(Number(count)));
    }
    
    // Submit Score Logic
    if (action === 'submitScore' || (postData.id && (postData.score !== undefined || postData.answers))) {
       return responseJSON(submitScore(postData));
    }

    return responseJSON({ 
      error: "Invalid Action or Missing Data", 
      receivedAction: action,
      debug: JSON.stringify(postData) 
    });

  } catch (err) {
    return responseJSON({ error: err.toString() });
  } finally {
    lock.releaseLock();
  }
}

function getRandomQuestions(count) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_QUESTIONS);
  if (!sheet) throw new Error("Sheet '" + SHEET_QUESTIONS + "' not found");
  
  const data = sheet.getDataRange().getValues();
  data.shift(); // Remove header
  
  // Clean Data
  const questions = data.map((row) => {
    return {
      id: row[0],
      question: row[1],
      options: [row[2], row[3], row[4], row[5]].filter(o => o !== ""), 
      correctAnswer: row[6] 
    };
  }).filter(q => q.question);
  
  // Shuffle
  const shuffled = questions.sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, count);
  
  // Remove answer for client
  const clientQuestions = selected.map(q => ({
    id: q.id,
    question: q.question,
    options: q.options
  }));
  
  return { questions: clientQuestions };
}

function submitScore(data) {
  const sheetQ = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_QUESTIONS);
  const dataQ = sheetQ.getDataRange().getValues();
  dataQ.shift(); 
  
  // Create Answer Map: ID -> Answer
  const answerMap = {};
  dataQ.forEach(row => {
    answerMap[row[0]] = row[6]; 
  });
  
  let score = 0;
  
  // Calculate Score (Server Side Validation)
  if (data.answers && Array.isArray(data.answers)) {
    data.answers.forEach(ans => {
      const correct = answerMap[ans.id];
      // Compare trimmed strings to be safe
      if (correct && String(correct).trim() === String(ans.selected).trim()) {
        score++;
      }
    });
  } else if (data.score !== undefined) {
    // Fallback if client sent score directly (legacy)
    score = Number(data.score);
  }
  
  updateUserSheet(data.id, score);
  
  return {
    score: score,
    ...getUserStats(data.id)
  };
}

function updateUserSheet(userId, currentScore) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_ANSWERS);
  if (!sheet) throw new Error("Sheet '" + SHEET_ANSWERS + "' missing");
  
  const data = sheet.getDataRange().getValues();
  let rowIndex = -1;
  const now = new Date();
  
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(userId)) {
      rowIndex = i;
      break;
    }
  }
  
  // Columns: ID, Plays, TotalScore, MaxScore, FirstClear, Comment, LastPlayed
  if (rowIndex > 0) {
    // Update existing
    const row = data[rowIndex];
    const plays = (row[1] || 0) + 1;
    const totalScore = (row[2] || 0) + currentScore;
    const maxScore = Math.max((row[3] || 0), currentScore);
    let firstClear = row[4];
    
    // Only write first clear score if it's empty.
    // Assuming any valid play counts? Or should check threshold?
    // Spec says: "若同 ID 已通關過，後續分數不覆蓋" -> Implies First Clear Score is persistent.
    if (firstClear === "" || firstClear === undefined) {
        firstClear = currentScore;
    }
    
    sheet.getRange(rowIndex + 1, 2).setValue(plays);
    sheet.getRange(rowIndex + 1, 3).setValue(totalScore);
    sheet.getRange(rowIndex + 1, 4).setValue(maxScore);
    sheet.getRange(rowIndex + 1, 5).setValue(firstClear);
    sheet.getRange(rowIndex + 1, 7).setValue(now);
    
  } else {
    // New User
    sheet.appendRow([
      userId,
      1,
      currentScore,
      currentScore, // Max
      currentScore, // First Clear (First time is always first clear record?)
      "", 
      now
    ]);
  }
}

function getUserStats(userId) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_ANSWERS);
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(userId)) {
      return {
        attempts: data[i][1],
        highScore: data[i][3],
        firstClearScore: data[i][4]
      };
    }
  }
  return {};
}

function responseJSON(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
