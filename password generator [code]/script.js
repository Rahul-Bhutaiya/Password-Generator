const passwordInput=document.querySelector('[password-text]');
const copyBtn=document.querySelector('[coppy-button]');
const copiedText=document.querySelector('[coppied-text]');
const passwordLengthDisplayer=document.querySelector('[password-length]');
const passwordLengthSlider=document.querySelector('[password-length-slider]');
const upperCase=document.querySelector('[uppercase]');
const lowerCase=document.querySelector('[lowercase]');
const numbers=document.querySelector('[numbers]');
const symbols=document.querySelector('[symbols]');
const passwordStrengthIndicator=document.querySelector('[password-strength-color]');
const passwordGeneratorButton=document.querySelector('[password-generator-button]');
const allCheckBoxes=document.querySelectorAll('input[type=checkbox]');
const symbolList = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

// initial values
let password='';
let checkboxCount=0;
let passwordLength=10;
const min = passwordLengthSlider.min;
const max = passwordLengthSlider.max;
setPasswordLength();
setCheckCount()

function setPasswordLength(){
    passwordLengthDisplayer.textContent=passwordLength;
    passwordLengthSlider.value=passwordLength;    
    passwordLengthSlider.style.backgroundSize =((passwordLength - min)*100/(max - min)) + "% 100%";
}

passwordLengthSlider.addEventListener('input',(event)=>{
    passwordLength=event.target.value;
    setPasswordLength();
})

function setCheckCount(){
    checkboxCount=0;
    allCheckBoxes.forEach((checkbox)=>{
        if(checkbox.checked) checkboxCount++;
    });

    if(checkboxCount>passwordLength){
        passwordLength=checkboxCount;
        setPasswordLength();
    }
}

allCheckBoxes.forEach((checkbox)=>{
    checkbox.addEventListener('change',setCheckCount);
})

async function copyPassword(){
    try{
        await navigator.clipboard.writeText(passwordInput.value);
        copiedText.textContent='copied';
    }
    catch(e){
        copiedText.textContent='Failed';
    }

    copiedText.classList.add('active');
    setTimeout(() => {
        copiedText.classList.remove('active');
    }, 2000);
}

copyBtn.addEventListener('click',()=>{
    if(passwordInput.value){
        copyPassword();
    }
});

function setPasswordStrengthColor(color){
    passwordStrengthIndicator.style.backgroundColor=color;
    passwordStrengthIndicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function setPasswordStrength(){
    let num=false;
    let upCase=false;
    let lowCase=false;
    let sym=false;
    if(numbers.checked) num=true;
    if(upperCase.checked) upCase=true;
    if(lowerCase.checked) lowCase=true;
    if(symbols.checked) sym=true;

    if(upCase && lowCase && num && sym && passwordLength>=6){
        setPasswordStrengthColor('#0f0');
    }
    else if(upCase && lowCase && (num || sym) && passwordLength>=8){
        setPasswordStrengthColor('#0f0');
    }    
    else if((upCase||lowCase) && (num||sym) && passwordLength>=12){
        setPasswordStrengthColor('#0f0');
    }
    else if((upCase||lowCase) && (num||sym) && passwordLength>=6){
        setPasswordStrengthColor('#ff0');
    }
    else{
        setPasswordStrengthColor('#f00');
    }
}

function getRandomInteger(min,max){
    return Math.floor(Math.random()*(max-min))+min;
}

function getRandomNumber(){
    return getRandomInteger(0,10);
}

function getRandomUppercase(){
    return String.fromCharCode(getRandomInteger(65,91));
}

function getRandomLowercase(){
    return String.fromCharCode(getRandomInteger(97,123));
}

function getRandomSymbol(){
    return symbolList[getRandomInteger(0,symbolList.length)];
}

function shufflePassword(array) {
    //Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

passwordGeneratorButton.addEventListener('click',()=>{
    if(checkboxCount==0){
        return;
    }

    if(checkboxCount>passwordLength){
        passwordLength=checkboxCount;
        setPasswordLength();
    }

    password='';

    let passwordType=[];

    if(upperCase.checked) passwordType.push(getRandomUppercase);
    if(lowerCase.checked) passwordType.push(getRandomLowercase);
    if(numbers.checked) passwordType.push(getRandomNumber);
    if(symbols.checked) passwordType.push(getRandomSymbol);

    passwordType.forEach((eachPassType)=>{
        password+=eachPassType();
    })

    for(let i=0;i<passwordLength-passwordType.length;i++){
        password+=passwordType[getRandomInteger(0,passwordType.length)]();
    }

    password=shufflePassword(password.split(''));

    passwordInput.value=password;
    
    setPasswordStrength();
});