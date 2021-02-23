const LanguageService = {
  getUsersLanguage(db, user_id) {
    return db
      .from('language')
      .select(
        'language.id',
        'language.name',
        'language.user_id',
        'language.head',
        'language.total_score',
      )
      .where('language.user_id', user_id)
      .first()
  },

  getLanguageWords(db, language_id) {
    return db
      .raw(`
        select 
          w.id, 
          w.language_id, 
          w.original,
          w.translation,
          w.next,
          w.memory_value,
          w.correct_count,
          w.incorrect_count,
          (select sum(w.correct_count) 
            from word w
            where w.language_id = 2
          ) as total_score
        from word w
        where w.language_id = 2
        group by 
          w.id, 
          w.language_id, 
          w.original,
          w.translation,
          w.next,
          w.memory_value,
          w.correct_count,
          w.incorrect_count;
      `)
    ;
  },
  getHeadWord(db, user_id) {
    return db
      .raw(`
        select 
          w.id, 
          w.original, 
          w.correct_count, 
          w.memory_value,
          w.incorrect_count, 
          w.next,
          l.head,
          (select sum(w.correct_count) 
            from word w
            inner join language l on w.language_id  = l.id
            where l.user_id = ${user_id}
          ) as total_score
        from word w
        inner join language l on w.language_id  = l.id
        where l.user_id = ${user_id}
          and l.head = w.id 
        group by w.id, w.original, w.correct_count, w.incorrect_count, w.next, l.head;
      `)
    ;
  },
  getAllWords(db, user_id) {
    return db
      .raw(`
        select 
          w.id, 
          w.original, 
          w.translation,
          w.memory_value,
          w.correct_count, 
          w.incorrect_count, 
          w.next,
          l.head,
          (select sum(w.correct_count) 
            from word w
            inner join language l on w.language_id  = l.id
            where l.user_id = ${user_id}
          ) as total_score
        from word w
        inner join language l on w.language_id  = l.id
        where l.user_id = ${user_id}
        group by w.id, w.original, w.correct_count, w.incorrect_count, w.next, l.head;
      `)
    ;
  },
  getFirstWord(db, user_id) {
    return db
    .raw(`
      select 
        *
      from word w
      inner join language l on w.language_id  = l.id
      where l.user_id = ${user_id}
        and w.id = l.head;
  `)
    ;
  },
  getNextWord(db, user_id, next) {
    return db
      .raw(`
        select 
          *
        from word w
        inner join language l on w.language_id  = l.id
        where l.user_id = ${user_id}
          and w.id = ${next};
      `)
    ;
  },
  checkWord(db, user_id) {
    return db
      .raw(`
        select 
          *
        from word w
        inner join language l on w.language_id = l.id
        where l.user_id = ${user_id}
          and l.head = w.id;
      `)
    ;
  },
  patchMovingWord(db, wordInfo, score) {
    let correctKey = '';
    if (wordInfo.incorrect_count) {
      correctKey = 'incorrect_count';
    } else if (wordInfo.correct_count) {
      correctKey = 'correct_count';
    }

    return db
      .raw(`
        update word
        set 
          ${correctKey} = ${score},
          memory_value = ${wordInfo.memory_value},
          next = ${wordInfo.next}
        where id = ${wordInfo.id};
      `)
    ;
  },
  patchAlteredWord(db, wordInfo) {
    return db
      .raw(`
        update word
        set
          next = ${wordInfo.next}
        where id = ${wordInfo.id};
      `);
  },
  patchHeadWord(db, userID, headID) {
    return db
      .raw(`
        update language
        set 
          head = ${headID}
        where user_id = ${userID};
      `)
    ;
  }
}

module.exports = LanguageService
