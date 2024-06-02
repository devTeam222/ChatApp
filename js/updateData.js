function createGroup() {
    
}
function getOrCreateConversation(id) {
    if (!id) { return {
        error: 'Invalid id'
    }; }
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open('POST', './apis/updateData.php');
        xhr.onload = () => {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    try {
                        let data = JSON.parse(xhr.response);
                        resolve(data)
                    } catch (error) {
                        console.warn(error);
                        console.warn(xhr.response);
                        reject();
                    }
                } else {
                    console.log('Erreur ' + xhr.status);
                    reject();
                }
            }
        };

        let form_data = new FormData();
        form_data.append("get_chat_id", id);
        xhr.send(form_data);
    })
}
export {
    getOrCreateConversation
}