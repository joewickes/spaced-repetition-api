const express = require('express')
const LanguageService = require('./language-service')
const { requireAuth } = require('../middleware/jwt-auth')
const bodyParser = require('body-parser').json()

const Config = require('./../config');
const UserService = require('../user/user-service');
const LinkedList = require('./LinkedList');

const languageRouter = express.Router()

languageRouter
  .use(requireAuth)
  .use(async (req, res, next) => {
    try {
      const language = await LanguageService.getUsersLanguage(
        req.app.get('db'),
        req.user.id,
      )

      if (!language)
        return res.status(404).json({
          error: `You don't have any languages`,
        })

      req.language = language
      next()
    } catch (error) {
      next(error)
    }
  })

languageRouter
  .get('/', async (req, res, next) => {
    try {
      const words = await LanguageService.getLanguageWords(
        req.app.get('db'),
        req.language.id,
      )

      res.json({
        language: req.language,
        words,
      })
      next()
    } catch (error) {
      next(error)
    }
  })

languageRouter
  .get('/head', async (req, res, next) => {
      LanguageService.getHeadWord(req.app.get('db'), req.user.id)
        .then(response => {
          const wordObj = {
            nextWord: response.rows[0].original,
            totalScore: parseInt(response.rows[0].total_score),
            wordCorrectCount: parseInt(response.rows[0].correct_count),
            wordIncorrectCount: parseInt(response.rows[0].incorrect_count)
          }
          res.json(wordObj);
        })
        .catch(error => {
          console.log(error)
          next();
        })
      ;
    ;
  })

languageRouter
  .use(bodyParser)
  .post('/guess', async (req, res, next) => {
    if (!req.body.guess) {
      res.status(400).send({ error: "Missing 'guess' in request body" });
    } else {
      LanguageService.getAllWords(req.app.get('db'), req.user.id)
        .then(response => {
          responseArr = response.rows;
          const linkedList = new LinkedList;
          const headItemId = responseArr[0].head;

          // Grab head and insert it first
          const head = responseArr.find(item => item.id === headItemId);
          let nextVal = head.next;
          const updateResponseArr = responseArr.filter(item => item.id !== headItemId);
          console.log('inserting head', head.id, nextVal)
          linkedList.insertItem(head, nextVal);

          for (let i = 0; i < updateResponseArr.length; i++) {
            const item = updateResponseArr.find(item => item.id === nextVal);
            nextVal = item.next;
            console.log('inserting not head', item.id, nextVal)
            linkedList.insertItem(item, nextVal);  
          }

          linkedList.walkThroughIds();

          const headInfo = linkedList.grabHeadInfo();
          
          if (linkedList.checkTranslation(req.body.guess)) {

            const memoryValue = headInfo.memory_value * 2;
            const movedInfo = linkedList.moveItem(memoryValue);
            
            const movingInfoDB = {
              correct_count: 1,
              memory_value: memoryValue,
              ...movedInfo.moving
            }

            Promise.all([
              LanguageService.patchMovingWord(req.app.get('db'), movingInfoDB, headInfo.correct_count + 1), 
              LanguageService.patchAlteredWord(req.app.get('db'), movedInfo.altered),
              LanguageService.patchHeadWord(req.app.get('db'), req.user.id, movedInfo.head.id)
            ]).then((results) => {
              const newHeadInfo = linkedList.grabHeadInfo();
              res.json({
                answer: headInfo.translation,
                isCorrect: true,
                nextWord: responseArr.find(item => item.id === headInfo.next).original,
                totalScore: parseInt(newHeadInfo.total_score) + 1,
                wordCorrectCount: newHeadInfo.correct_count,
                wordIncorrectCount: newHeadInfo.incorrect_count
              });
            });            
          } else {
            const memoryValue = 1;
            const movedInfo = linkedList.moveItem(memoryValue);
            
            const movingInfoDB = {
              memory_value: memoryValue,
              incorrect_count: 1,
              ...movedInfo.moving
            }

            Promise.all([
              LanguageService.patchMovingWord(req.app.get('db'), movingInfoDB, headInfo.incorrect_count + 1), 
              LanguageService.patchAlteredWord(req.app.get('db'), movedInfo.altered),
              LanguageService.patchHeadWord(req.app.get('db'), req.user.id, movedInfo.head.id)
            ]).then((results) => {
              const newHeadInfo = linkedList.grabHeadInfo();
              res.json({
                answer: headInfo.translation,
                isCorrect: false,
                nextWord: responseArr.find(item => item.id === headInfo.next).original,
                totalScore: parseInt(headInfo.total_score),
                wordCorrectCount: newHeadInfo.correct_count,
                wordIncorrectCount: newHeadInfo.incorrect_count
              });
            });
          }
        })
      ;  
    }
  })
;

module.exports = languageRouter
