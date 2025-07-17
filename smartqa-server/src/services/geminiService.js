const Questions = require("../models/Questions");
const axios =require('axios');

const callGemini =async (questions) =>{
    const prompy =`
    Given the following list of question from audience,
    groip them if they are similar,and return a sorted list
    with the most frequently asked question or relevent question summarized:


    ${questions.map(
        (ques,index) => `${index+1}. ${ques.content}`
    ).join("\n")}
   
   
    Respond with only summarized list , one per line
    
    
    `;

    const url ="https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";
    const requestBody ={
        content : [{
            parts: [{text: prompt}]
        }]
    };

    const requestHeader={
        headers:{
        "Content-Type":"application/json",
        "X-goog-api-key":process.env.GEMINI_API_KEY
        }
    };
    const response = await axios.post(url,requestBody,requestHeader);

    const text =response.data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    return text.split("\n").filter((line) => line.trim() !=="");



};
module.exports ={callGemini};