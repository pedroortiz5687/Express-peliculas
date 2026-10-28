const express = require('express');
const app= express();


app.use(express.json());


const movies = [
 {id: 1, title:"Inception", description:"Una pelicula de ciencia ficción dirigida por Cristopher Nolan", votes:0},  
 {id: 2, title: "Titanic", description:"Historia romántica dirigida por James Cameron", votes:0}, 
 {id: 3, title:"The Matrix", description:"Pelicul de accion y ciencia ficció dirigida por los hermanos Wachowski", votes:0} 
];


app.get('/movies', (req, res) => {
   res.json(movies); 
})

app.get('/movie/:id', (req, res)=> {
 const movieID= Number(req.params.id);
 if (isNaN(movieID)) {
  return res.status(400).json({ message: "El id debe ser un número" });
 }
 const movie=movies.find(m=> m.id===movieID);

 if (!movie){
    return res.status(404).json({message:"La pelicula no fue encontrada"});   
 }
 res.json(movie);
})


app.post('/vote/:id', (req, res)=> {
    const movieID=Number(req.params.id);
    if (isNaN(movieID)) {
  return res.status(400).json({ message: "El id debe ser un número" });
 }
    const movie=movies.find(m=> m.id===movieID);

    if (!movie){
        return res.status(404).json({message:"La pelicula no exise"});
    }
    movie.votes+=1;
    return res.status(200).json({message:"El voto fue registrado con exito"});
})


app.get("/result", (req, res)=>{
    const sortedMovies=[...movies].sort((a, b)=> b.votes - a. votes);

    const result=sortedMovies.map(movie=>(
        {
            id:movie.id,
            title:movie.title,
            votes:movie.votes
        }
    ));
    res.json(result);
});

app.post('/movies', (req, res) => {
  const { title, description } = req.body;

  if(!title || !description){
    return res.status(400).json({message:"faltan datos necesarios"});
}


  const newId = movies.length > 0 ? Math.max(...movies.map(m => m.id)) + 1 : 1;

  const newMovie = {
    id: newId,
    title: title,
    description: description,
    votes: 0
  };

  movies.push(newMovie);
  return res.status(201).json({message:"Su pelicula a sido creada", movie: newMovie});

  
});

app.put('/movies/:id', (req, res)=>{
    const movieID=Number(req.params.id);
    if (isNaN(movieID)) {
  return res.status(400).json({ message: "El id debe ser un número" });
 }
    const {title, description}= req.body;

    const movie=movies.find(element=> element.id ===movieID);

    if(!movie){
     return res.status(404).json({message:"no existe"})
    }



if (title) movie.title = title;
  

  if (description) movie.description = description;

 
return res.status(200).json({ message: "Película actualizada con éxito", movie });

});




app.delete('/movies/:id',(req, res)=>{
   const movieID=Number(req.params.id);
   if (isNaN(movieID)) {
  return res.status(400).json({ message: "El id debe ser un número" });
 }
   const movie=movies.find(element=>element.id===movieID);

   if(!movie){
    return res.status(404).json({message:"pelicula no existe"})
   }
   if(movie.votes > 0){
    return res.status(400).json({message:"No se puede eliminar por que ya tiene votos"})

   }
   const eliminar= movies.findIndex(id=> id.id===movieID);
   movies.splice(eliminar, 1);
   return res.status(200).json({ message: "Película eliminada con éxito" });
   
});

app.listen(3000, () =>{
    console.log('servidor corriendo en http://localhost:3000');

});