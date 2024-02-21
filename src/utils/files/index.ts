
export const saveFile = (filename: string, dataURL: string) => {
    const link = document.createElement("a");
    document.body.appendChild(link);
    link.href = dataURL;
    link.download = `${filename}.json`;
    link.click();
    document.body.removeChild(link);
};

export const saveJson = (filename, obj) => {

    const dataURL = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(obj));

    saveFile(filename, dataURL);
};

export const readImageFile = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            var img = new Image();
            img.onload = () => {
                resolve(img);
            };
            img.onerror = reject;
            img.src = event.target.result as string;
        };
        if (file) {
            reader.readAsDataURL(file);
        } else {
            reject();
        }
    });
};


export const readFileBlob = (file): Promise<Blob> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            resolve(event.target.result as unknown as Blob);
        };
        if (file) {
            reader.readAsText(file);
        } else {
            reject();
        }
    });
};