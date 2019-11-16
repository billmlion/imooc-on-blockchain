pragma solidity ^0.4.24;

contract CourseList{
    address public ceo;
    address[] public courses;

    constructor() public {
       ceo = msg.sender;
    }
    
    function createCourse(string _name,string _content, uint _target,uint _fundingPrice,uint _price, string _img) public{
        address newCourse = new Course(ceo, msg.sender, _name,_content, _target, _fundingPrice, _price, _img);
        courses.push(newCourse);
    }
  
    //获取课程所有地址
    function getCourse() public view returns(address[]){
        return courses;
    }

     function removeCourse(uint _index) public{
         // 只有ceo能删除
         require(msg.sender == ceo);
         //根据索引删除
         require(_index < courses.length);
         
         uint len = courses.length;
         for(uint i=_index; i< len-1; i++){
             courses[i] =  courses[i+1];
         }

         delete courses[len-1];
         courses.length--;
     }

     function isCeo() public view returns(bool){
         if(msg.sender==ceo){
             return true;
         }else {
             return false;
         }
        //  return msg.sender==ceo;
     }

    //  function getCEO() public view returns(address){
    //     return ceo;
    // }


}


// 1.如果收到钱大于目标，课程方可上线
// 2.上线前的钱 ceo不分
// 3.上线之后卖的钱 ceo分1成

contract Course{
    address public owner;
    address public ceo;

    string public name;
    string public content;
    uint public target;
    uint public fundingPrice;
    uint public price;
    string public img;
    string public video;
    bool public isOnline;
    uint public count;
    //用户购买信息
    mapping(address=>uint) public users;

    constructor(address _ceo,address _owner,string _name, string _content, uint _target,uint _fundingPrice, 
    uint _price,string _img) public{
        ceo = _ceo;
        owner = _owner;
        content = _content;
        target = _target;
        fundingPrice = _fundingPrice;
        img = _img;
        video = '';
        price = _price;
        count = 0;
        isOnline = false;
        name = _name;
    }

     //众筹或购买
    function buy() public payable{
        //1.用户没有购买过
        require(users[msg.sender]==0);
        if(isOnline){
         //如果上线了，必须得用上线价格购买
         require(price == msg.value);
        }else{
            require(fundingPrice == msg.value);
        }
        users[msg.sender] = msg.value;
        count +=1;

        if(target <= count * fundingPrice){
            //钱超出目标
            if(isOnline){
               //上之后购买
               uint value = msg.value;
               ceo.transfer(value/10);
               owner.transfer(value-value/10);
            }else{
                //没上线 第一次超出
               isOnline = true;
                //转账
                //上线之前的钱，都在合约内部，众筹者拿不到
                owner.transfer(count*fundingPrice);
            }
        }

    }

    function addVideo(string _video) public{
        require(msg.sender == owner);
        require(isOnline == true);
        video = _video;
    }

    //获取详情信息
    function getDetail() public view returns(string,string,uint,uint,uint,string,string,uint,bool,uint){
      uint role;
      if(owner==msg.sender){
          role =0; //课程创建者
      }else if(users[msg.sender] >0){
          role = 1;//已购买
      }else{
          role =2; //没买
      } 
     return (
         name,
         content,
         target,
         fundingPrice,
         price,
         img,
         video,
         count,
         isOnline,
         role
     );
    }
}