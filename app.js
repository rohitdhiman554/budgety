var budgetController=(function()
{
	var Expenses=function(id,description,value)
	{
		this.id=id;
		this.description=description;
		this.value=value;
	};

	var Income=function(id,description,value)
	{
		this.id=id;
		this.description=description;
		this.value=value;
	};
	Expenses.prototype.calcPercentage=function(totalIncome)
	{
		if(totalIncome>0)
		{
			this.percentage=Math.round((this.value/totalIncome)*100);
		}
		else
		{
			this.percentage=-1;
		}

	};
	Expenses.prototype.getPercentage=function()
	{
		return this.percentage;
	}
	var calculateTotal=function(type)
	{
		var sum=0;
		data.allItems[type].forEach(function(cur)
		{
			sum=sum+cur.value;
		});
		data.totals[type]=sum;
	}; 
	var data={
		allItems:{
			exp:[],
			inc:[]
		},
		totals:{
			exp:0,
			inc:0,
		},
		budget:0,
		percentage:-1, 
	};

	return{
		addItem:function(type,description,value)
		{
			var ID,newItem;
			if(data.allItems[type].length>0)
			{
			ID=data.allItems[type][data.allItems[type].length-1].id+1;
		}
		else	
		{
			ID=0;
		}
		
			if(type==='exp')
			{
				newItem=new Expenses(ID,description,value);
			}
			else if(type==='inc')
			{
				newItem=new Income(ID,description,value);

			}

      data.allItems[type].push(newItem);
			return newItem;

		},

		deleteItem:function(type,id)
		{
			//id=6;
			//data.allItems[type][id];
			//[1,2,4,6,8]
			//index=3
			ids=data.allItems[type].map(function(current)//map returns an array;
			{
				return current.id;

			});
			index=ids.indexOf(id);
			if(index!==-1)
			{
				data.allItems[type].splice(index,1);
			}

		},

	
		calculateBudget:function()
		{
			//Calculate total income and expenses
			calculateTotal('exp');
			calculateTotal('inc');
			//calculate total budget
			data.budget=data.totals.inc-data.totals.exp;
			//calculate percentage of income that we spent
			if(data.totals.inc>0)
			{
			data.percentage=Math.round((data.totals.exp/data.totals.inc)*100);
		}
		else
		{
			data.percentage=-1;
		}
		},


			calculatePercentages:function()
		{
			data.allItems.exp.forEach(function(cur)
			{
				cur.calcPercentage(data.totals.inc);
			});


		},
		getPercentages:function()
		{
			var allPerc=data.allItems.exp.map(function(cur)
			{
				return cur.getPercentage();

			});
			return allPerc;
		},

		getBudget:function(){
			return{
				budget: data.budget,
				totalInc: data.totals.inc,
				totalExp: data.totals.exp,
				percentage: data.percentage
			};
		},

		testing: function() {
           console.log(data);
       }
	};
	



})();


var uiController=(function()
{
	var DOMstring=
	{
		inputType:'.add__type',
		inputDescription:'.add__description',
		inputValue:'.add__value',
		inputBtn:'.add__btn',
		incomeContainer:'.income__list',
		expenseContainer:'.expenses__list',
		budgetLabel:'.budget__value',
		incomeLabel:'.budget__income--value',
		expenseLabel:'.budget__expenses--value',
		percentageLabel:'.budget__expenses--percentage',
		container:'.container',
		setMonthAndYear:'.budget__title--month',
		expensePercLabel:'.item__percentage',
		buttonLabel:'.add__btn',


	};
	var formatNumber =function(num,type)
		{
			var numSplit,int,dec;
			num=Math.abs(num);
			num=num.toFixed(2);
			numSplit=num.split('.');
			int =numSplit[0];
			if(int.length>3)
			{
				int=int.substr(0,int.length-3)+','+int.substr(int.length-3,3);
			}
			dec=numSplit[1];
			return (type==='exp'?'-':'+')+' '+int+'.'+dec; 


		};
		var nodeListForEach=function(list,callback)
			{
				for(var i=0;i<list.length;i++)
				{
					callback(list[i],i);
				}


			};
	return{
		getinput:function()
		{
			return{	
			 type:document.querySelector(DOMstring.inputType).value,
			 description:document.querySelector(DOMstring.inputDescription).value,
			 value:parseFloat(document.querySelector(DOMstring.inputValue).value),
            }; 
		},
			addList:function(obj,type)
		{
			var html,newHtml,element;
			if(type==='inc')
			{
				element=DOMstring.incomeContainer;
				html='<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
			}
			else if(type=='exp')
			{
				element=DOMstring.expenseContainer;
				html='<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                          
			}
			newHtml=html.replace('%id%',obj.id);
			newHtml=newHtml.replace('%description%',obj.description);
			newHtml=newHtml.replace('%value%',formatNumber(obj.value,type));

			document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);


		},
		

		removeList:function(id)
		{
			var element=document.getElementById(id);
			element.parentNode.removeChild(element);


		},

		clearField:function()
		{
			var field,fieldArr;
			field=document.querySelectorAll(DOMstring.inputDescription+', '+DOMstring.inputValue);
			fieldArr=Array.prototype.slice.call(field);
			fieldArr.forEach(function(current,index,array)
			{
				current.value='';

			});
			fieldArr[0].focus();



		},
		displayDate:function()
		{
			var date,year,month,months;
			date=new Date();
			year=date.getFullYear();
			month=date.getMonth();
			months=['January','February','March','April','May','June','July','August','September','October','November','December'];
			document.querySelector(DOMstring.setMonthAndYear).textContent=months[month-1]+' '+year;
		},
		display:function(obj)
		{
			var type;
			obj.budget>0?type='inc':type='exp'
			document.querySelector(DOMstring.budgetLabel).textContent=formatNumber(obj.budget,type);
			document.querySelector(DOMstring.incomeLabel).textContent=formatNumber(obj.totalInc,'inc');
			document.querySelector(DOMstring.expenseLabel).textContent=formatNumber(obj.totalExp,'exp');
			if(obj.percentage>0)
			{
			document.querySelector(DOMstring.percentageLabel).textContent=obj.percentage+'%';
}
else
{
	document.querySelector(DOMstring.percentageLabel).textContent='---';
}

		},
		displayPercentages:function(percentages)
		{
			var fields=document.querySelectorAll(DOMstring.expensePercLabel);
			

			nodeListForEach(fields,function(current,index)
				{
					if(percentages[index]>0)
					{
					current.textContent=percentages[index]+'%';
				}
				else
				{
					current.textContent='---';
				}

				});


		},
		changedType: function() {

            var fields = document.querySelectorAll(`${DOMstring.inputType}, ${DOMstring.inputDescription}, ${DOMstring.inputValue}`)

        nodeListForEach(fields, function(cur) {
            cur.classList.toggle('red-focus');
        });

        document.querySelector(DOMstring.buttonLabel).classList.toggle('red');
    },

		


		getDOMString:function()
		{
			return DOMstring;
		}
	


	};

})();








var controller=(function(budgetCtrl,uiCtrl)
{
	var DOM=uiCtrl.getDOMString();
	
	 var addEventListener=function()
	 {
	 		document.querySelector(DOM.inputBtn).addEventListener('click',function()
	{
		ctrlAddItem();



	});
	 		

	
	document.addEventListener('keypress',function(event)
	{
		if(event.keyCode==13)
		{
		ctrlAddItem();
	}
	});
	document.querySelector(DOM.container).addEventListener('click',ctrlDeleteItem);
		document.querySelector(DOM.inputType).addEventListener('change',uiCtrl.changedType);



	 };

	 var updateBudget=function()
	 {
	 	budgetCtrl.calculateBudget();

	 	var budget=budgetCtrl.getBudget();
	 	uiCtrl.display(budget);
	 };


	 var updatePercentage=function()
	{
		//calculate percentage
	 	budgetCtrl.calculatePercentages();
	 	
		//read percentage from budgetcontroller

        var percentages=budgetCtrl.getPercentages();


		//update the UI with new percentage

 	     uiCtrl.displayPercentages(percentages);
	}

	

	
	var ctrlAddItem=function()
	{
		var input,newItem;
		 input=uiCtrl.getinput();


		 if(input.description!=''&&parseFloat(input.value)>0)
		 {
		newItem=budgetCtrl.addItem(input.type,input.description,input.value);
		uiCtrl.addList(newItem,input.type);
		uiCtrl.clearField();
         }
         else
         {
         	alert('please fill the fields');
         }


       updateBudget();
       updatePercentage();







	};

	


	var ctrlDeleteItem=function(event)
	{ 
		var itemID,splitID,type,ID;
		itemID=event.target.parentNode.parentNode.parentNode.parentNode.id;
		if(itemID)
		{
		splitID=itemID.split('-');
		type=splitID[0];
		ID=parseInt(splitID[1]);
		budgetCtrl.deleteItem(type,ID);
		uiCtrl.removeList(itemID);
		updateBudget();
		updatePercentage();


}


	};
	return{
		init:function()
		{
			uiCtrl.displayDate();
	
			uiCtrl.display(
				{budget:0,
				totalInc:0,
				totalExp: 0,
				percentage:-1}
				);
			addEventListener();
		}
	}




})(budgetController,uiController);
controller.init();