const validateEmail = (email) => {
    /*
      Пример ограничений входа в систему:
       1) длина от 4 до 32 ch.
       2) использовать англ. только буквы, цифры и '-' '_'
    */
    const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_";
    if (email.length < 4 || email.length > 32) {
      return false;
    }
  
    const arr = email
      .split("")
      .filter((ch) => alphabet.includes(ch) || !Number.isNaN(+ch)); // email в массив символов
  
    if (arr.length !== email.length) {
      // email содержит запрещенные символы
      return false;
    }
  
    return true;
  }
  
  export { validateEmail as default };