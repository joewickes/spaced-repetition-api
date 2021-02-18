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
      .from('word')
      .select(
        'id',
        'language_id',
        'original',
        'translation',
        'next',
        'memory_value',
        'correct_count',
        'incorrect_count',
      )
      .where({ language_id })
  },
  getNextWord(db, user_id) {
    return db
      .raw(`
      select 
        w.id, 
        w.original, 
        w.correct_count, 
        w.incorrect_count, 
        w.next,
        l.head,
        (select sum(w.correct_count - w.incorrect_count) 
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
  
  }
}

module.exports = LanguageService
