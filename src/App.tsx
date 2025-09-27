import { useState, useMemo } from 'react'

import './App.css'

let items: number[] = Array.from(Array(50).keys());

const SIZE_CLASSES = ['', 'wide', 'tall', 'big'];
const WEIGHTS = [60, 15, 15, 10]; // сумма = 100

const getRandomSizeClass = () => {
  const rand = Math.random() * 100;
  let sum = 0;
  for (let i = 0; i < WEIGHTS.length; i++) {
    sum += WEIGHTS[i];
    if (rand < sum) return SIZE_CLASSES[i];
  }
  return '';
};



function App() { 
    // Генерируем классы один раз и сохраняем
  const itemsWithSizes = useMemo(() => {
    return items.map(item => ({
      ...item,
      sizeClass: getRandomSizeClass()
    }));
  }, [items]); // перегенерируется только если `items` изменились 
  return (
    <div className='Gallery'>
      {items.map((_,i) => (<GalleryItem key={i}/>))}
    </div>
  )
}

function GalleryItem (){
  return (<div className='Gallery-Item'></div>)
}

export default App;
