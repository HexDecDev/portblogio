import mongoose from 'mongoose'
var db = mongoose.connection;
const Schema = mongoose.Schema;

//Main Settings (Я надеюсь сюда не только пассворд пойдет в будущем)
const SettingsSchema = new Schema({
    password: {type: String, required: true}
});
const Settings = mongoose.model('Settings', SettingsSchema);

//Sessions
const SessionsSchema = new Schema({
    sessionID: {type: String, required: true},
    date: { type: Date, required: true } 
});
const Session = mongoose.model('Session', SessionsSchema);
const sessionSalt = 'jkcnebf734jf8dhjncviusimn';

//Posts
const PostsSchema = new Schema({
    title: {type: String, required: true},
    post: {type: String, required: true},
    header: {type: String, required: true},
    category: {type: String, required: true},
    date:  {type: Date, required: true } 
});
const Post = mongoose.model('Post', PostsSchema);


export function NewPost(title, post, header, category){
    const newPost = new Post({
        title:title, 
        post: post,
        header: header,
        category: category,
        date: new Date()
    })

    return newPost.save();
}

export function GetPostByTitle(title){
    return Post.findOne({title: title});
}

export function GetPostByID(id){
    return Post.findOne({_id: id});
}

export function EditPost(id, title, post, header, category){
    return Post.findOneAndUpdate({_id: id}, { $set:{ title: title, post: post,  header: header, category: category }});
}

export function DeletePost(id){
    return Post.findOne({_id: id}).remove();
}


export function GetPostsList(skip, limit){
    return Post.find({}, null, {sort: {date: -1}}).skip(skip).limit(limit);
}

export function GetPostsInCategory(skip, limit, category){
    return Post.find({category: category}).skip(skip).limit(limit);
}

export function GetPostsCount(){
    return Post.count({});
}

export function GetPostsCountInCategory(category){
    return Post.count({category: category});
}




export function StringGen(len) {
    var text = "";
    
    var charset = "abcdefghijklmnopqrstuvwxyz0123456789";
    
    for( var i=0; i < len; i++ )
        text += charset.charAt(Math.floor(Math.random() * charset.length));
    
    return text;
}

export function ConnectToDB() {
    mongoose.connect('mongodb://localhost/portoblogio');
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {
        console.log('MongoDB connection established');
    });
}

export function SetNewPassword(passwd)
{
    return Settings.count().then( data => {


        if (data === 0 ) {
            console.log('No password! Recording current...')
            const settings = new Settings({
                password: passwd
            });
            return settings.save().then(() => `New ${passwd}`);
        }

        console.log('Password already here! Updating')
        return Settings.findOneAndUpdate({}, { $set:{ password: passwd }}).then(() => `Password updated with hash: ${passwd}`);

    });
}

export function CheckPassword(passwd){
    return Settings.findOne({}).then(res => res.password === passwd);
}

export function CheckSession(hash){
    return Session.findOne({sessionID: hash}).then(res => res.sessionID === hash);
}

export function SetSession(crypto){

    const sessionID = StringGen(18);
    const hash = crypto.createHmac('sha256', sessionSalt).update(sessionID).digest('hex');
    
    const session = new Session({
        sessionID: hash,
        date: new Date()
    });

    return session.save().then(() => hash);

}

export function ClearOldSessions(){

    return Session.count().then( data => {

        var totalCount = data;

        for (var i = 0; i < totalCount; i++ ){

            Session.find().skip(i).limit(1).then(data1 => {

                var currentDate = new Date();
                var destroyDate = new Date (currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 7);
                if (data1[0].date < destroyDate) Session.find({sessionID: data1[0].sessionID}).remove().then( () => console.log('Session destroyed'));
                else (console.log('Session is valid, skip...'))

            })
        }

    });
}