
export const add = async (url, data) => {
    const res = await fetch("http://localhost:27017/" + url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    const serverRes = await res.text();
    return serverRes;
}


export const update = async (url, id, data) => {

    const res = await fetch("http://localhost:27017/" + url + "/" + id, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),

    });
    const serverRes = await res.text();
    return serverRes;
};



export const getItem = async (url, id) => {
    const res = await fetch("http://localhost:27017/" + url + "/" + id);
    const data = await res.json();
    return data;
}

export const getGemachim = async () => {
    const res = await fetch("http://localhost:27017/gemachim");
    const data = await res.json();
    return data;
}

export const deleteItem = async (url, id) => {

    const res = await fetch("http://localhost:27017/" + url + "/" + id, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    });
    const serverRes = await res.text();
    return serverRes;
};
