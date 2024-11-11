// ==UserScript==
// @name         私有网盘后台提交
// @namespace    http://tampermonkey.net/
// @version      2024-11-10
// @description  为我的网盘添加数据
// @author       学奇
// @match        https://www.123pan.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=123pan.com
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // 等待页面加载完成
    window.addEventListener('load', function () {
        const table = document.querySelector('tbody.ant-table-tbody');
        if (table) {
            const checkboxes = table.querySelectorAll('input[type="checkbox"]');
            checkboxes.forEach(checkbox => {
                checkbox.addEventListener('change', function () {
                    if (this.checked) {
                        const row = this.closest('tr');
                        const cells = row.querySelectorAll('td');
                        let rowText = '';
                        rowText += cells[1].textContent.trim()
                        console.log(rowText);
                        //弹出提交表单
                        mySubmit(rowText);
                    } else {
                        //销毁提交表单容器
                        const formContainer = document.getElementById('formContainer');
                        if (formContainer) {
                            formContainer.remove();
                        }


                    }
                });
            });
        }
    });


    function mySubmit(content) {
        // 检查是否已经存在表单容器
        const existingFormContainer = document.getElementById('formContainer');

        if (existingFormContainer) {
            return;
        } else {
            // 如果不存在表单容器，创建新的表单容器和表单
            createFormContainer(content);
        }

        //创建表单容器和表单
        function createFormContainer(content) {
            // 创建表单的容器
            const formContainer = document.createElement('div');
            formContainer.id = 'formContainer';
            formContainer.style.background = 'white';
            formContainer.style.padding = '30px';
            formContainer.style.borderRadius = '10px';
            formContainer.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.2)';
            formContainer.style.maxWidth = '400px';
            formContainer.style.width = '100%';
            formContainer.style.position = 'fixed';
            formContainer.style.zIndex = '999';
            formContainer.style.bottom = '0';
            formContainer.style.right = '0';
            // 创建表单
            const form = document.createElement('form');
            form.id = 'fileForm';
            form.innerHTML = `
<div style="margin-bottom: 20px;display: none;">
    <input type="text" id="fileUser" placeholder="User" value="sxq" required style="display: block;margin-bottom: 5px;font-weight: bold;color: #555;width: 100%;padding: 12px;border: 1px solid #ccc;border-radius: 5px;transition: border-color 0.3s;box-sizing: border-box;">
</div>
<div style="margin-bottom: 20px;display: none;">
    <label for="fileType" style="display: block;margin-bottom: 5px;font-weight: bold;color: #555;">操作方式</label>
    <select id="fileType" name="type" style="width: 100%;padding: 12px;border: 1px solid #ccc;border-radius: 5px;transition: border-color 0.3s;box-sizing: border-box;">
        <option value="add">添加数据</option>
    </select>
</div>
<div style="margin-bottom: 20px;">
    <input type="text" id="fileName" placeholder="输入文件名" disabled required style="display: block;margin-bottom: 5px;font-weight: bold;color: #555;width: 100%;padding: 12px;border: 1px solid #ccc;border-radius: 5px;transition: border-color 0.3s;box-sizing: border-box;">
</div>
<div style="margin-bottom: 20px;">
    <input type="text" id="fileUrl" placeholder="输入URL" style="display: block;margin-bottom: 5px;font-weight: bold;color: #555;width: 100%;padding: 12px;border: 1px solid #ccc;border-radius: 5px;transition: border-color 0.3s;box-sizing: border-box;" required>
</div>
<button type="submit" style="width: 100%;padding: 12px;background-color: #96dee0;color: white;border: none;border-radius: 5px;font-weight: bold;cursor: pointer;transition: background-color 0.3s;">提交</button>
`;

            // 创建消息显示区域
            const messageDiv = document.createElement('div');
            messageDiv.id = 'message';
            messageDiv.textContent = '请操作';
            messageDiv.style.textAlign = 'center';
            messageDiv.style.marginTop = '15px';
            messageDiv.style.color = '#0652dd';

            // 将表单和消息显示区域添加到容器中
            formContainer.appendChild(form);
            formContainer.appendChild(messageDiv);

            // 将整个容器添加到页面中
            document.body.appendChild(formContainer);

            // 初始化表单内容
            document.getElementById('fileName').value = content;

            // 添加表单提交事件监听器
            form.addEventListener('submit', function (e) {
                e.preventDefault();

                var fileName = document.getElementById('fileName').value;
                var fileUrl = document.getElementById('fileUrl').value;
                var fileType = document.getElementById('fileType').value;
                var fileUser = document.getElementById('fileUser').value;

                console.log('文件名：' + fileName + ', 文件地址：' + fileUrl);

                var xhr = new XMLHttpRequest();
                xhr.open('POST', '/#', true);
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.onreadystatechange = function () {
                    if (xhr.readyState === 4 && xhr.status === 200) {
                        document.getElementById('message').innerText = xhr.responseText;
                        setTimeout(() => {
                            document.getElementById('message').innerText = '请操作';
                        }, 400);
                    }
                };
                xhr.send(JSON.stringify({ fileUser: fileUser, fileType: fileType, fileName: fileName, fileUrl: fileUrl }));
            });
        }




    }
})();