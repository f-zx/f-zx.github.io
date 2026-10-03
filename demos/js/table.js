// alert('table.js')//检查是否导入成功

//新增数据函数
function addRow(){
    var table = document.getElementById('table');
    // console.log(table);//检查是否获取成功

    var length =table.rows.length;
    // console.log(length);//检查行数,获取插入的位置
    // 插入行节点
    var newRow = table.insertRow(length);
    // console.log(newRow);//检查
    
    //插入列节点对象
    var nameCol = newRow.insertCell(0);
    var phoneCol = newRow.insertCell(1);
    var actionCol = newRow.insertCell(2);

    // console.log(newRow);检查

    //修改节点文本内容
    nameCol.innerHTML = '未命名'
    phoneCol.innerHTML = '无联系方式'
    actionCol.innerHTML = '<button onclick="editRow(this)">编辑</button><button onclick="deleteRow(this)">删除</button>'
  
}
    

    //删除函数
function deleteRow(button) {
    // console.log(button);//检查
    var row = button.parentNode.parentNode;
    // console.log(row);//检查
    row.parentNode.removeChild(row);
}

//编辑数据函数
function editRow(button){
    // console.log(button);//检查
    var row = button.parentNode.parentNode;
    var name = row.cells[0];
    var phone = row.cells[1];

    var inputname = prompt("请输入名字：");
    var inputphone = prompt("请输入联系方式：");

    name.innerHTML = inputname;
    phone.innerHTML = inputphone;
}