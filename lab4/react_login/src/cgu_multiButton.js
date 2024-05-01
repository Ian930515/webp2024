const changeText=(event)=>{
    console.log(event.target)
    event.target.innerText = event.target.innerText + "被點了"
    }
const MultiButton=(num)=>{
    var output=[];
    for(let i=1;i<num+1;++i)
        output.push(<button onClick={changeText}>第{i}個按鍵</button>)
    return output;
    }

    export default MultiButton;
    