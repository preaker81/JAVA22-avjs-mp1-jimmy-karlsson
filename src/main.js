const img = document.createElement('img');



const imgUrl = new URL('./media/placeholderImage.png', import.meta.url);
img.src = imgUrl.href;
document.body.append(img);

console.log(import.meta);

