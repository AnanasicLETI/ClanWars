const VkBot = require('node-vk-bot-api'); // Основа
const api = require('node-vk-bot-api/lib/api'); // Библиотека для получения имени в ВК
const Markup = require('node-vk-bot-api/lib/markup'); // Библиотека для клавиатуры
const token = process.env.TOKEN // Токен группы
const bot = new VkBot(token); // Авторизация в вк
const mongoose = require("mongoose"); // Модуль mongoose
const Schema = mongoose.Schema; // Создание схемы
// Подключение к mongoose
mongoose.connect(process.env.URL, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

// Клавиатура
const MainKeyBoard = Markup.keyboard([[Markup.button('Деревня ⛪', 'primary'),],[Markup.button('Лагерь 🎪', 'primary'),Markup.button('Лаборатория 💈', 'primary'),],[Markup.button('Магазин 🏹', 'positive'),],[Markup.button('Атаковать ⚔', 'negative'),],])
const AttackKeyBoard = Markup.keyboard([[Markup.button('Далее ➡', 'primary'),Markup.button('Отмена ❌', 'positive'),],[Markup.button('Атаковать ⚔', 'negative'),],])

// установка схем
// Схема пользователя
const userScheme = new Schema({
    VK_ID: Number, // ВК ID пользователя
    ID: Number, // ID пользователя
    Name: String, // Им пользователя
    Gold: Number, // Голда
    Gems: Number, // Кристаллов
    TownHall: Number, // Уровень деревни
    Guardian: Number, // Стражи
    GuardinLevel: Number, // Уровень стражей
    Camp: Number, // Тренировочный лагерь
    CampCount: Number, // Кол-во людей
    Laboratory: Number, // Уровень лаборатории
    Vikings: Number, // Кол-во викингов
    VikingLevel: Number, // Уровень викингов
    Goblins: Number, // Кол-во гоблинов
    GoblinLevel: Number, // Уровень гоблина
    Gigants: Number, // Кол-во гигантов
    GigantLevel: Number, // Уровень гигантов
    Dragons: Number, // Кол-во драконов
    DragonLevel: Number, // Уровень драконов
    Pekka: Number, // Кол-во пек
    PekkaLevel: Number, // Уровень пеки
    Cannons: Number, // Кол-во пушек
    CannonsLevel: Number, // Уровень пушки
    Tower: Number, // Кол-во башень
    TowerLevel: Number, // Уровень башни
    KingGoblin: Number, // Есть ли король гоблинов
    KingGoblinHealth: Number, // Кол-во его хп
    TheKeeper: Number, // Есть ли хранитель
    Finder: Number, // Кого нашел
    Attack: Number, // Нападение
    Guard: Number, // защищается
    War: Number, // Идет ли война
    Time: Number, // Время для атаки
    Cups: Number, // Кубков
    Wins: Number, // Побед
}); 
const User = mongoose.model("users", userScheme); // сама коллекция с пользователями

// Регистрация пользователя
async function RegisterPlayer(ID)
{
    const data = await api('users.get', {user_ids: ID,access_token: token}); // Получение имени через модуль
    let CountPlayers = 0;
    for(const user of await User.find().exec())
    {
        CountPlayers++;
    }
    await User.create({VK_ID: ID, 
        ID: 1000+CountPlayers, 
        Name: data.response[0].first_name, 
        Gold: 100, 
        Gems: 0, 
        TownHall: 1, 
        Guardian: 5, 
        GuardinLevel: 1, 
        Camp: 1, 
        CampCount: 0,  
        Laboratory: 1,
        Vikings: 0, 
        VikingLevel: 1, 
        Goblins: 0, 
        GoblinLevel: 1, 
        Gigants: 0, 
        GigantLevel: 1, 
        Dragons: 0, 
        DragonLevel: 1,
        Pekka: 0, 
        PekkaLevel: 1, 
        Cannons: 1, 
        CannonsLevel: 1,
        Tower: 1,
        TowerLevel: 1, 
        KingGoblin: 0,
        KingGoblinHealth: 0,
        TheKeeper: 0,
        Finder: 0, 
        Attack: 0,
        Guard: 0,
        War: 0,
        Time: 0,
        Cups: 0,
        Wins: 0}); // Функция создания записи в базе данных
}
// Функция бота: Команда - <Начать>, lower = True
bot.command('начать', async (ctx) => {

    // Клавиатура для бота
    let TrueKeyBoard = null;
    if (ctx.message.from_id == ctx.message.peer_id) TrueKeyBoard = MainKeyBoard;

    if (!await User.findOne({VK_ID: ctx.message.from_id}).exec()) // Проверка регистрации
    {
        if (ctx.message.from_id == ctx.message.peer_id) // Проверка на ввод сообщение на прямую боту
        {
            await RegisterPlayer(ctx.message.from_id); // Регистрация пользователя
            await ctx.reply('🏹 Привествую вас!\nВ данной игре вы являетесь вождем деревни.\nУлучшайте деревню, атакуйте других чтобы выжить!\n\nПросмотр команд: Команды', null, TrueKeyBoard);
        }
        else return true;
    }
    else await ctx.reply('🏹 Что вы хотите начать?', null, TrueKeyBoard);
});
// Функция бота: Команда - <Команды>, lower = True
bot.command('команды', async (ctx) => {

    // Клавиатура для бота
    let TrueKeyBoard = null;
    if (ctx.message.from_id == ctx.message.peer_id) TrueKeyBoard = MainKeyBoard;

    if (!await User.findOne({VK_ID: ctx.message.from_id}).exec()) // Проверка регистрации
    {
        if (ctx.message.from_id == ctx.message.peer_id) // Проверка на ввод сообщение на прямую боту
            await RegisterPlayer(ctx.message.from_id); // Регистрация пользователя
        else return true;
    }
    await ctx.reply('🔎 Основные команды:\n\n\
    ⛪ Деревня - статистика деревни\n\
    🎪 Лагерь - в лагере находятся бойцы\n\
    🗿 Тренировать - тренировка бойцов\n\n\
    💈 Лаборатория - просмотр лабораториn\n\
    🥼 Улучшить - улучшение чего либо\n\n\
    🏹 Магазин - просмотр и покупка предметов\n\n\
    ⚔ Атаковать - поиск и атака врага\n\
    ❌ Отмена - отменить поиск врага\n\n\
    🕶 Ник <Имя> - смена ника\n\
    💸 Передать <ID> <кол-во> - передача злата игроку', null, TrueKeyBoard);
});
// Функция бота: Команда - <Передать>, lower = True
bot.command('передать', async (ctx) => {

    // Клавиатура для бота
    let TrueKeyBoard = null;
    if (ctx.message.from_id == ctx.message.peer_id) TrueKeyBoard = MainKeyBoard;

    if (!await User.findOne({VK_ID: ctx.message.from_id}).exec()) // Проверка регистрации
    {
        if (ctx.message.from_id == ctx.message.peer_id) // Проверка на ввод сообщение на прямую боту
            await RegisterPlayer(ctx.message.from_id); // Регистрация пользователя
        else return true;
    }
    const user = await User.findOne({VK_ID: ctx.message.from_id}).exec();
    if(user.War != 0)
        return await ctx.reply(` 🏹 Вы находитесь в бою/обороне...`, null, TrueKeyBoard);
    const args = ctx.message.text.split(' ');
    if(!args[1] || !args[2])
        return await ctx.reply('🏹 Используйте: Передать <ID> <сумма>', null, TrueKeyBoard);
    const tradeID = parseInt(args[1]);
    const money = parseInt(args[2]);
    if(money <= 20)
        return await ctx.reply('🏹 Сумма перевода недолжна быть меньше 20 злата..', null, TrueKeyBoard);

    if(user.ID == tradeID)
        return await ctx.reply('🏹 Самому себе нельзя..', null, TrueKeyBoard);

    if (!await User.findOne({ID: tradeID}).exec()) // Проверка регистрации
        return await ctx.reply('🏹 Данного пользователя не существует..', null, TrueKeyBoard);

    if(user.Gold < money)
        return await ctx.reply('🏹 У вас недостаточно средств для перевода..', null, TrueKeyBoard);

    const trade = await User.findOne({ID: tradeID}).exec();
    await User.findOneAndUpdate({VK_ID: ctx.message.from_id},{ Gold: user.Gold - money }).exec();
    await ctx.reply(`🏹 Вы успешно перевели злата ${money}, игроку [id${trade.VK_ID}|${trade.Name}]\nОстаток: ${user.Gold - money} злата`, null, TrueKeyBoard);
    await User.findOneAndUpdate({VK_ID: trade.VK_ID},{ Gold: user.trade + money}).exec();
    await bot.sendMessage(trade.VK_ID, `🏹 Вам поступил перевод ${money} злата, от игрока [id${user.VK_ID}|${user.Name}]\nВсего: ${trade.Gold+money} злата`);
});
// Функция бота: Команда - <Ник>, lower = True
bot.command('ник', async (ctx) => {

    // Клавиатура для бота
    let TrueKeyBoard = null;
    if (ctx.message.from_id == ctx.message.peer_id) TrueKeyBoard = MainKeyBoard;

    if (!await User.findOne({VK_ID: ctx.message.from_id}).exec()) // Проверка регистрации
    {
        if (ctx.message.from_id == ctx.message.peer_id) // Проверка на ввод сообщение на прямую боту
            await RegisterPlayer(ctx.message.from_id); // Регистрация пользователя
        else return true;
    }
    const user = await User.findOne({VK_ID: ctx.message.from_id}).exec();
    if(user.War != 0)
        return await ctx.reply(` 🏹 Вы находитесь в бою/обороне...`, null, TrueKeyBoard);
    const args = ctx.message.text.split(' ');
    if(!args[1])
        return await ctx.reply('🏹 Используйте: Ник <имя>', null, TrueKeyBoard);
    if(args[1].length < 5 || args[1].length > 15)
        return await ctx.reply('🏹 Длина ника не должна быть меньше 5 или больше 15..', null, TrueKeyBoard);

    await User.findOneAndUpdate({VK_ID: ctx.message.from_id},{ Name: args[1] }).exec();
    await ctx.reply(`🏹 Вы успешно сменили имя на ${args[1]}`, null, TrueKeyBoard);
});
// Функция бота: Команда - <Деревня>, lower = True
bot.command('деревня', async (ctx) => {

    // Клавиатура для бота
    let TrueKeyBoard = null;
    if (ctx.message.from_id == ctx.message.peer_id) TrueKeyBoard = MainKeyBoard;

    if (!await User.findOne({VK_ID: ctx.message.from_id}).exec()) // Проверка регистрации
    {
        if (ctx.message.from_id == ctx.message.peer_id) // Проверка на ввод сообщение на прямую боту
            await RegisterPlayer(ctx.message.from_id); // Регистрация пользователя
        else return true;
    }
    const user = await User.findOne({VK_ID: ctx.message.from_id}).exec(); // Поиск пользователя и запись в переменную
    if(user.War != 0)
        return await ctx.reply(` 🏹 Вы находитесь в бою/обороне...`, null, TrueKeyBoard);
    let messageKings = "";
    if(user.KingGoblin)
        messageKings += `🧝 Король гоблинов: ${user.KingGoblin} уровень.\n- Здоровье короля: ${user.KingGoblinHealth}/${user.KingGoblin*50}`;
    if(user.TheKeeper)
        messageKings += `🧙 Хранитель злата: ${user.TheKeeper} уровень\n- Хранитель злата сохраняет ${user.TheKeeper*2}% от воровонного злата`;
    await ctx.reply(` ⛪ ${user.Name}, ваша деревня:\n\n\
    📌 Персональный ID: ${user.ID}\n\
    🕍 Ратуша: ${user.TownHall} уровень.\n\
    💰 Состояние хранилища: ${user.Gold} золота.\n\n\
    💂 Стражей деревни: ${user.Guardian} людей.\n\
    🛡 Пушки: ${user.Cannons}/${user.TownHall*2} | Уровень: ${user.CannonsLevel}
    🏹 Башня с лучниками: ${user.Tower}/${user.TownHall*3} | Уровень: ${user.TowerLevel}\n\
    ${messageKings}\n\n\
    🏆 Кубков: ${user.Cups}\n\
    👑 Побед: ${user.Wins}`, null, TrueKeyBoard);
});
// Функция бота: Команда - <Лагерь>, lower = True
bot.command('лагерь', async (ctx) => {

    // Клавиатура для бота
    let TrueKeyBoard = null;
    if (ctx.message.from_id == ctx.message.peer_id) TrueKeyBoard = MainKeyBoard;

    if (!await User.findOne({VK_ID: ctx.message.from_id}).exec()) // Проверка регистрации
    {
        if (ctx.message.from_id == ctx.message.peer_id) // Проверка на ввод сообщение на прямую боту
            await RegisterPlayer(ctx.message.from_id); // Регистрация пользователя
        else return true;
    }
    const user = await User.findOne({VK_ID: ctx.message.from_id}).exec(); // Поиск пользователя и запись в переменную
    if(user.War != 0)
        return await ctx.reply(` 🏹 Вы находитесь в бою/обороне...`, null, TrueKeyBoard);
    let messageCamp = "⚔ Бойцы:\n";
    if(user.Vikings + user.Goblins + user.Dragons + user.Pekka == 0)
        messageCamp = "В тренировочном лагере пусто..\nДля тренировки ваших бойцов\n- Тренировать <кого тренировать> <кол-во>";
    
    if(user.Vikings > 0)
        messageCamp += `🦸‍♂️ Викинги: ${user.Vikings} [${user.VikingLevel}]\n`;

    if(user.Goblins > 0)
        messageCamp += `🧟‍♂️ Гоблинов: ${user.Goblins} [${user.GoblinLevel}]\n`;

    if(user.Gigants > 0)
        messageCamp += `👹 Гигантов: ${user.Gigants} [${user.GigantLevel}]\n`;

    if(user.Dragons > 0)
        messageCamp += `👿 Драконов: ${user.Dragons} [${user.DragonLevel}]\n`;

    if(user.Pekka > 0)
        messageCamp += `🤖 Пекк: ${user.Pekka} [${user.PekkaLevel}]\n`;

    await ctx.reply(` 🎪 ${user.Name}, тренировочный лагерь:\n\n\
    ⛺ Вместительность: ${user.CampCount}/${user.Camp*15} | Уровень ${user.Camp}\n\n${messageCamp}`, null, TrueKeyBoard);
});
// Функция бота: Команда - <Тренировать>, lower = True
bot.command('тренировать', async (ctx) => {

    // Клавиатура для бота
    let TrueKeyBoard = null;
    if (ctx.message.from_id == ctx.message.peer_id) TrueKeyBoard = MainKeyBoard;

    if (!await User.findOne({VK_ID: ctx.message.from_id}).exec()) // Проверка регистрации
    {
        if (ctx.message.from_id == ctx.message.peer_id) // Проверка на ввод сообщение на прямую боту
            await RegisterPlayer(ctx.message.from_id); // Регистрация пользователя
        else return true;
    }
    const user = await User.findOne({VK_ID: ctx.message.from_id}).exec(); // Поиск пользователя и запись в переменную
    if(user.War != 0)
        return await ctx.reply(` 🏹 Вы находитесь в бою/обороне...`, null, TrueKeyBoard);
    const args = ctx.message.text.split(' ');
    if(!args[1] || !args[2])
        return await ctx.reply(` 🏹 Используйте: Тренировать <название бойца> <кол-во>\n\
                                Тренировки бойцов требует трат злата!\n\n\
                                🦸‍♂️ Викинг = ${user.VikingLevel*2} злата\n\
                                🧟‍♂️ Гоблин = ${user.GoblinLevel*4} злата\n\
                                👹 Гигант = ${user.GigantLevel*6} злата\n\
                                👿 Дракон = ${user.DragonLevel*8} злата\n\
                                🤖 Пекка = ${user.PekkaLevel*10} злата\n`, null, TrueKeyBoard);
    const ammount = parseInt(args[2]);
    if(ammount + user.CampCount > user.Camp*15)
        return await ctx.reply(' 🏹 Для такого количества бойцов нет места!', null, TrueKeyBoard);

    if(args[1].toLowerCase() == 'викинг')
    {
        if(user.Gold < user.VikingLevel*2*ammount)
            return await ctx.reply(' 🏹 Недостаточно средств!', null, TrueKeyBoard);

        await User.findOneAndUpdate({VK_ID: ctx.message.from_id},{ Gold: user.Gold - user.VikingLevel*2*ammount, Vikings: user.Vikings + ammount, CampCount: user.CampCount + ammount }).exec();
        return await ctx.reply(` 🦸‍♂️ Тренировка викингов закончена!\nВыпущено бойцов ${ammount}.`, null, TrueKeyBoard);
    }
    else if(args[1].toLowerCase() == 'гоблин')
    {
        if(user.Camp < 2)
            return await ctx.reply(' 🏹 Тренировочный лагерь недостаточно улучшен..\nГоблинов можно тренировать только со 2 уровня лагеря', null, TrueKeyBoard);
        
        if(user.Gold < user.GoblinLevel*4*ammount)
            return await ctx.reply(' 🏹 Недостаточно средств!', null, TrueKeyBoard);

        await User.findOneAndUpdate({VK_ID: ctx.message.from_id},{ Gold: user.Gold - user.GoblinLevel*4*ammount, Goblins: user.Goblins + ammount, CampCount: user.CampCount + ammount }).exec();
        return await ctx.reply(` 🧟‍♂️ Тренировка гоблинов закончена!\nВыпущено бойцов ${ammount}.`, null, TrueKeyBoard);
    }
    else if(args[1].toLowerCase() == 'гигант')
    {
        if(user.Camp < 3)
            return await ctx.reply(' 🏹 Тренировочный лагерь недостаточно улучшен..\nГигантов можно тренировать только со 3 уровня лагеря', null, TrueKeyBoard);
        
        if(user.Gold < user.GigantLevel*6*ammount)
            return await ctx.reply(' 🏹 Недостаточно средств!', null, TrueKeyBoard);

        await User.findOneAndUpdate({VK_ID: ctx.message.from_id},{ Gold: user.Gold - user.GigantLevel*6*ammount, Gigants: user.Gigants + ammount, CampCount: user.CampCount + ammount }).exec();
        return await ctx.reply(` 👹 Тренировка гигантов закончена!\nВыпущено бойцов ${ammount}.`, null, TrueKeyBoard);
    }
    else if(args[1].toLowerCase() == 'дракон')
    {
        if(user.Camp < 4)
            return await ctx.reply(' 🏹 Тренировочный лагерь недостаточно улучшен..\nДраконов можно тренировать только со 4 уровня лагеря', null, TrueKeyBoard);
        
        if(user.Gold < user.DragonLevel*8*ammount)
            return await ctx.reply(' 🏹 Недостаточно средств!', null, TrueKeyBoard);

        await User.findOneAndUpdate({VK_ID: ctx.message.from_id},{ Gold: user.Gold - user.DragonLevel*8*ammount, Dragons: user.Dragons + ammount, CampCount: user.CampCount + ammount }).exec();
        return await ctx.reply(` 👿 Тренировка драконов закончена!\nВыпущено бойцов ${ammount}.`, null, TrueKeyBoard);
    }
    else if(args[1].toLowerCase() == 'пекка')
    {
        if(user.Camp < 5)
            return await ctx.reply(' 🏹 Тренировочный лагерь недостаточно улучшен..\nПекку можно тренировать только со 5 уровня лагеря', null, TrueKeyBoard);
        
        if(user.Gold < user.PekkaLevel*10*ammount)
            return await ctx.reply(' 🏹 Недостаточно средств!', null, TrueKeyBoard);

        await User.findOneAndUpdate({VK_ID: ctx.message.from_id},{ Gold: user.Gold - user.PekkaLevel*10*ammount, Pekka: user.Pekka + ammount, CampCount: user.CampCount + ammount }).exec();
        return await ctx.reply(` 🤖 Тренировка пекк закончена!\nВыпущено бойцов ${ammount}.`, null, TrueKeyBoard);
    }
    else return await ctx.reply(' 🏹 Такого персонажа не существует!', null, TrueKeyBoard);
});
// Функция бота: Команда - <Лаборатория>, lower = True
bot.command('лаборатория', async (ctx) => {

    // Клавиатура для бота
    let TrueKeyBoard = null;
    if (ctx.message.from_id == ctx.message.peer_id) TrueKeyBoard = MainKeyBoard;

    if (!await User.findOne({VK_ID: ctx.message.from_id}).exec()) // Проверка регистрации
    {
        if (ctx.message.from_id == ctx.message.peer_id) // Проверка на ввод сообщение на прямую боту
            await RegisterPlayer(ctx.message.from_id); // Регистрация пользователя
        else return true;
    }
    let messageLaboratory = '⚔ Доступны к прокачке:\n';
    const user = await User.findOne({VK_ID: ctx.message.from_id}).exec(); // Поиск пользователя и запись в переменную
    if(user.War != 0)
        return await ctx.reply(` 🏹 Вы находитесь в бою/обороне...`, null, TrueKeyBoard);

    if(user.VikingLevel != user.Laboratory + 1)
        messageLaboratory += `🦸‍♂️ Викинг: доступно к улучшению\n- Стоимость улучшения: ${user.VikingLevel*100} злата\n`;
    
    if(user.GoblinLevel != user.Laboratory + 1 && user.Laboratory >= 2)
        messageLaboratory += `🧟‍♂️ Гоблин: доступно к улучшению\n- Стоимость улучшения: ${user.GoblinLevel*200} злата\n`;

    if(user.GigantLevel != user.Laboratory + 1 && user.Laboratory >= 3)
        messageLaboratory += `👹 Гигант: доступно к улучшению\n- Стоимость улучшения: ${user.GigantLevel*300} злата\n`;

    if(user.DragonLevel != user.Laboratory + 1 && user.Laboratory >= 4)
        messageLaboratory += `👿 Дракон: доступно к улучшению\n- Стоимость улучшения: ${user.DragonLevel*400} злата\n`;

    if(user.PekkaLevel != user.Laboratory + 1 && user.Laboratory >= 5)
        messageLaboratory += `🤖 Пекка: доступно к улучшению\n- Стоимость улучшения: ${user.PekkaLevel*500} злата\n`;

    await ctx.reply(` 💈 ${user.Name}, ваша лаборатория:\n\
    💉 Уровень лаборатории: ${user.Laboratory}\n\n\
    ${messageLaboratory}\n\n\
    - Для улучшения бойцов:\n\
    Улучшить <название бойца>`, null, TrueKeyBoard);
});
// Функция бота: Команда - <Улучшить>, lower = True
bot.command('улучшить', async (ctx) => {

    // Клавиатура для бота
    let TrueKeyBoard = null;
    if (ctx.message.from_id == ctx.message.peer_id) TrueKeyBoard = MainKeyBoard;

    if (!await User.findOne({VK_ID: ctx.message.from_id}).exec()) // Проверка регистрации
    {
        if (ctx.message.from_id == ctx.message.peer_id) // Проверка на ввод сообщение на прямую боту
            await RegisterPlayer(ctx.message.from_id); // Регистрация пользователя
        else return true;
    }
    const user = await User.findOne({VK_ID: ctx.message.from_id}).exec(); // Поиск пользователя и запись в переменную
    if(user.War != 0)
        return await ctx.reply(` 🏹 Вы находитесь в бою/обороне...`, null, TrueKeyBoard);
    const args = ctx.message.text.split(' ');
    if(!args[1])
        return await ctx.reply(` 🏹 С помощью улучшений можно повысить уровень:\n\
        ⛪ Ратуша - стоимость ${user.TownHall*500} злата\n\
        💈 Лаборатория - стоимость ${user.Camp*200} злата\n\
        🎪 Лагерь - стоимость ${user.Laboratory*300} злата\n\n\
        🛡 Пушка - стоимость ${user.CannonsLevel*100} злата\n\
        🏹 Башня - стоимость ${user.TowerLevel*100} злата\n\
        💂 Стражи - стоимость ${user.GuardinLevel*100} злата\n\n\
        🦸‍♂️ Викинг - стоимость ${user.VikingLevel*100} злата\n\
        🧟‍♂️ Гоблин - стоимость ${user.GoblinLevel*200} злата\n\
        👹 Гигант - стоимость ${user.GigantLevel*300} злата\n\
        👿 Дракон - стоимость ${user.DragonLevel*400} злата\n\
        🤖 Пекка - стоимость ${user.PekkaLevel*500} злата\n\n
        🧝 Король\n\
        🧙 Хранитель\n\n
        Используйте: Улучшить <что улучшить>\n`, null, TrueKeyBoard);

    if(args[1].toLowerCase() == 'викинг')
    {
        if(user.Gold < user.VikingLevel*100)
            return await ctx.reply(' 🏹 Недостаточно средств!', null, TrueKeyBoard);

        if(user.VikingLevel == user.Laboratory + 1)
            return await ctx.reply(' 🏹 У вас уже прокачен данный персонаж на максимально возможный уровень', null, TrueKeyBoard);

        await User.findOneAndUpdate({VK_ID: ctx.message.from_id},{ Gold: user.Gold - user.VikingLevel*100, VikingLevel: user.VikingLevel + 1 }).exec();
        return await ctx.reply(` 🦸‍♂️ Улучшение викинга завершено\nСтоимость: ${user.VikingLevel*100} злата\nУровень викинга: ${user.VikingLevel+1}`, null, TrueKeyBoard);
    }
    else if(args[1].toLowerCase() == 'гоблин')
    {
        if(user.Gold < user.GoblinLevel*200)
            return await ctx.reply(' 🏹 Недостаточно средств!', null, TrueKeyBoard);

        if(user.Laboratory < 2)
            return await ctx.reply(' 🏹 Ваша лаборатория недостаточно улучшена, чтобы прокачать данного персонажа.', null, TrueKeyBoard);

        if(user.GoblinLevel == user.Laboratory + 1)
            return await ctx.reply(' 🏹 У вас уже прокачен данный персонаж на максимально возможный уровень', null, TrueKeyBoard);

        await User.findOneAndUpdate({VK_ID: ctx.message.from_id},{ Gold: user.Gold - user.GoblinLevel*200, GoblinLevel: user.GoblinLevel + 1 }).exec();
        return await ctx.reply(` 🧟‍♂️ Улучшение гоблина завершено\nСтоимость: ${user.GoblinLevel*200} злата\nУровень гоблина: ${user.GoblinLevel+1}`, null, TrueKeyBoard);
    }
    else if(args[1].toLowerCase() == 'гигант')
    {
        if(user.Gold < user.GigantLevel*300)
            return await ctx.reply(' 🏹 Недостаточно средств!', null, TrueKeyBoard);

        if(user.Laboratory < 3)
            return await ctx.reply(' 🏹 Ваша лаборатория недостаточно улучшена, чтобы прокачать данного персонажа.', null, TrueKeyBoard);

        if(user.GigantLevel == user.Laboratory + 1)
            return await ctx.reply(' 🏹 У вас уже прокачен данный персонаж на максимально возможный уровень', null, TrueKeyBoard);

        await User.findOneAndUpdate({VK_ID: ctx.message.from_id},{ Gold: user.Gold - user.GigantLevel*300, GigantLevel: user.GigantLevel + 1 }).exec();
        return await ctx.reply(` 👹 Улучшение гиганта завершено\nСтоимость: ${user.GigantLevel*300} злата\nУровень гиганта: ${user.GigantLevel+1}`, null, TrueKeyBoard);
    }
    else if(args[1].toLowerCase() == 'дракон')
    {
        if(user.Gold < user.DragonLevel*400)
            return await ctx.reply(' 🏹 Недостаточно средств!', null, TrueKeyBoard);

        if(user.Laboratory < 4)
            return await ctx.reply(' 🏹 Ваша лаборатория недостаточно улучшена, чтобы прокачать данного персонажа.', null, TrueKeyBoard);

        if(user.DragonLevel == user.Laboratory + 1)
            return await ctx.reply(' 🏹 У вас уже прокачен данный персонаж на максимально возможный уровень', null, TrueKeyBoard);

        await User.findOneAndUpdate({VK_ID: ctx.message.from_id},{ Gold: user.Gold - user.DragonLevel*400, DragonLevel: user.DragonLevel + 1 }).exec();
        return await ctx.reply(` 👿 Улучшение дракона завершено\nСтоимость: ${user.DragonLevel*400} злата\nУровень дракона: ${user.DragonLevel+1}`, null, TrueKeyBoard);
    }
    else if(args[1].toLowerCase() == 'пекка')
    {
        if(user.Gold < user.PekkaLevel*500)
            return await ctx.reply(' 🏹 Недостаточно средств!', null, TrueKeyBoard);

        if(user.Laboratory < 5)
            return await ctx.reply(' 🏹 Ваша лаборатория недостаточно улучшена, чтобы прокачать данного персонажа.', null, TrueKeyBoard);

        if(user.PekkaLevel == user.Laboratory + 1)
            return await ctx.reply(' 🏹 У вас уже прокачен данный персонаж на максимально возможный уровень', null, TrueKeyBoard);

        await User.findOneAndUpdate({VK_ID: ctx.message.from_id},{ Gold: user.Gold - user.PekkaLevel*500, PekkaLevel: user.PekkaLevel + 1 }).exec();
        return await ctx.reply(` 🤖 Улучшение пекка завершено\nСтоимость: ${user.PekkaLevel*500} злата\nУровень пекка: ${user.PekkaLevel+1}`, null, TrueKeyBoard);
    }
    else if(args[1].toLowerCase() == 'ратуша')
    {
        if(user.Gold < user.TownHall*500)
            return await ctx.reply(' 🏹 Недостаточно средств!', null, TrueKeyBoard);

        if(user.TownHall == 5)
            return await ctx.reply(' 🏹 У вас уже максимальный уровень ратуши.', null, TrueKeyBoard);

        await User.findOneAndUpdate({VK_ID: ctx.message.from_id},{ Gold: user.Gold - user.TownHall*500, TownHall: user.TownHall + 1 }).exec();
        return await ctx.reply(` 🏹 Улучшение ратуши завершено!\nСтоимость: ${user.TownHall*500} злата\nУровень: ${user.TownHall+1}`, null, TrueKeyBoard);
    }
    else if(args[1].toLowerCase() == 'лагерь')
    {
        if(user.Gold < user.Camp*200)
            return await ctx.reply(' 🏹 Недостаточно средств!', null, TrueKeyBoard);

        if(user.TownHall == user.Camp)
            return await ctx.reply(' 🏹 Для улучшения лагеря нужно иметь ратушу выше уровня!', null, TrueKeyBoard);

        if(user.Camp == 5)
            return await ctx.reply(' 🏹 У вас уже максимальный уровень лагеря.', null, TrueKeyBoard);

        await User.findOneAndUpdate({VK_ID: ctx.message.from_id},{ Gold: user.Gold - user.Camp*200, Camp: user.Camp + 1 }).exec();
        return await ctx.reply(` 🏹 Улучшение лагеря завершено!\nСтоимость: ${user.Camp*200} злата\nУровень: ${user.Camp+1}`, null, TrueKeyBoard);
    }
    else if(args[1].toLowerCase() == 'лаборатория')
    {
        if(user.Gold < user.Laboratory*300)
            return await ctx.reply(' 🏹 Недостаточно средств!', null, TrueKeyBoard);

        if(user.TownHall == user.Laboratory)
            return await ctx.reply(' 🏹 Для улучшения лаборатория нужно иметь ратушу выше уровня!', null, TrueKeyBoard);

        if(user.Laboratory == 5)
            return await ctx.reply(' 🏹 У вас уже максимальный уровень лагеря.', null, TrueKeyBoard);

        await User.findOneAndUpdate({VK_ID: ctx.message.from_id},{ Gold: user.Gold - user.Laboratory*300, Laboratory: user.Laboratory + 1 }).exec();
        return await ctx.reply(` 🏹 Улучшение лаборатория завершено!\nСтоимость: ${user.Laboratory*300} злата\nУровень: ${user.Laboratory+1}`, null, TrueKeyBoard);
    }
    else if(args[1].toLowerCase() == 'пушка')
    {
        if(user.Gold < user.CannonsLevel*100)
            return await ctx.reply(' 🏹 Недостаточно средств!', null, TrueKeyBoard);

        if(user.TownHall + 1 == user.CannonsLevel)
            return await ctx.reply(' 🏹 Для улучшения пушек нужно иметь ратушу выше уровня!', null, TrueKeyBoard);

        await User.findOneAndUpdate({VK_ID: ctx.message.from_id},{ Gold: user.Gold - user.CannonsLevel*100, CannonsLevel: user.CannonsLevel + 1 }).exec();
        return await ctx.reply(` 🏹 Улучшение пушек завершено!\nСтоимость: ${user.CannonsLevel*100} злата\nУровень: ${user.CannonsLevel+1}`, null, TrueKeyBoard);
    }
    else if(args[1].toLowerCase() == 'башня')
    {
        if(user.Gold < user.TowerLevel*100)
            return await ctx.reply(' 🏹 Недостаточно средств!', null, TrueKeyBoard);

        if(user.TownHall + 1 == user.TowerLevel)
            return await ctx.reply(' 🏹 Для улучшения башни нужно иметь ратушу выше уровня!', null, TrueKeyBoard);

        await User.findOneAndUpdate({VK_ID: ctx.message.from_id},{ Gold: user.Gold - user.TowerLevel*100, TowerLevel: user.TowerLevel + 1 }).exec();
        return await ctx.reply(` 🏹 Улучшение башни завершено!\nСтоимость: ${user.TowerLevel*100} злата\nУровень: ${user.TowerLevel+1}`, null, TrueKeyBoard);
    }
    else if(args[1].toLowerCase() == 'стражи')
    {
        if(user.Gold < user.GuardinLevel*100)
            return await ctx.reply(' 🏹 Недостаточно средств!', null, TrueKeyBoard);

        if(user.TownHall + 1 == user.GuardinLevel)
            return await ctx.reply(' 🏹 Для улучшения башни нужно иметь ратушу выше уровня!', null, TrueKeyBoard);

        await User.findOneAndUpdate({VK_ID: ctx.message.from_id},{ Gold: user.Gold - user.GuardinLevel*100, GuardinLevel: user.GuardinLevel + 1 }).exec();
        return await ctx.reply(` 🏹 Улучшение стражей завершено!\nСтоимость: ${user.GuardinLevel*100} злата\nУровень: ${user.GuardinLevel+1}`, null, TrueKeyBoard);
    }
    else if(args[1].toLowerCase() == 'король')
    {
        if(user.KingGoblin == 0)
            return await ctx.reply(' 🏹 У вас не имеется король гоблинов!', null, TrueKeyBoard);

        if(user.Gold < user.KingGoblin*25)
            return await ctx.reply(' 🏹 Недостаточно средств!', null, TrueKeyBoard);

        if(user.TownHall * 5 == user.KingGoblin)
            return await ctx.reply(' 🏹 Для улучшения короля нужно иметь ратушу выше уровня!', null, TrueKeyBoard);

        await User.findOneAndUpdate({VK_ID: ctx.message.from_id},{ Gold: user.Gold - user.KingGoblin*25, KingGoblin: user.KingGoblin + 1 }).exec();
        return await ctx.reply(` 🏹 Улучшение короля завершено!\nСтоимость: ${user.KingGoblin*25} злата\nУровень: ${user.KingGoblin+1}`, null, TrueKeyBoard);
    }
    else if(args[1].toLowerCase() == 'хранитель')
    {
        if(user.TheKeeper == 0)
            return await ctx.reply(' 🏹 У вас не имеется хранителя!', null, TrueKeyBoard);

        if(user.Gold < user.TheKeeper*50)
            return await ctx.reply(' 🏹 Недостаточно средств!', null, TrueKeyBoard);

        if(user.TownHall * 2 == user.TheKeeper)
            return await ctx.reply(' 🏹 Для улучшения хранителя нужно иметь ратушу выше уровня!', null, TrueKeyBoard);

        await User.findOneAndUpdate({VK_ID: ctx.message.from_id},{ Gold: user.Gold - user.TheKeeper*50, TheKeeper: user.TheKeeper + 1 }).exec();
        return await ctx.reply(` 🏹 Улучшение хранителя завершено!\nСтоимость: ${user.TheKeeper*50} злата\nУровень: ${user.TheKeeper+1}`, null, TrueKeyBoard);
    }
    else return await ctx.reply(' 🏹 Я тебя не понял.. Что ты хочешь улучшить?', null, TrueKeyBoard);
});
// Функция бота: Команда - <магазин>, lower = True
bot.command('магазин', async (ctx) => {

    // Клавиатура для бота
    let TrueKeyBoard = null;
    if (ctx.message.from_id == ctx.message.peer_id) TrueKeyBoard = MainKeyBoard;

    if (!await User.findOne({VK_ID: ctx.message.from_id}).exec()) // Проверка регистрации
    {
        if (ctx.message.from_id == ctx.message.peer_id) // Проверка на ввод сообщение на прямую боту
            await RegisterPlayer(ctx.message.from_id); // Регистрация пользователя
        else return true;
    }
    const user = await User.findOne({VK_ID: ctx.message.from_id}).exec(); // Поиск пользователя и запись в переменную
    if(user.War != 0)
        return await ctx.reply(` 🏹 Вы находитесь в бою/обороне...`, null, TrueKeyBoard);
    const args = ctx.message.text.split(' ');
    if(!args[1] || !args[2])
        return await ctx.reply(` 🏹 Ассортимент магазина:\n\n\
        🛡 Пушка - стоимость за пушку ${user.CannonsLevel*10} злата\n\
        🏹 Башня - стоимость за башню ${user.TowerLevel*10} злата\n\n\
        🧝 Король - стоимость короля 50 злата\n\
        🧙 Хранитель - стоиомость хранителя 150 злата\n\n\
        Используйте: Магазин <название> <кол-во>`, null, TrueKeyBoard);
    const ammount = parseInt(args[2]);
    if(args[1].toLowerCase() == 'пушка' || args[1].toLowerCase() == 'пушку')
    {
        if(user.Cannons == user.TownHall * 2)
            return await ctx.reply(' 🏹 Чтобы иметь больше пушек, улучшите ратушу!', null, TrueKeyBoard);

        if(user.Cannons + ammount > user.TownHall * 2)
            return await ctx.reply(' 🏹 Нет места для стольки пушек!', null, TrueKeyBoard);

        if(user.Gold < user.CannonsLevel*10*ammount)
            return await ctx.reply(' 🏹 Недостаточно средств!', null, TrueKeyBoard);

        await User.findOneAndUpdate({VK_ID: ctx.message.from_id},{ Gold: user.Gold - user.CannonsLevel*10*ammount, Cannons: user.Cannons + ammount }).exec();
        return await ctx.reply(` 🏹 Вы успешно построили X${ammount} пушек!\nСтоимость: ${user.CannonsLevel*10*ammount} злата.`, null, TrueKeyBoard);
    }
    else if(args[1].toLowerCase() == 'башня' || args[1].toLowerCase() == 'башню')
    {
        if(user.Tower == user.TownHall * 3)
            return await ctx.reply(' 🏹 Чтобы иметь больше пушек, улучшите ратушу!', null, TrueKeyBoard);

        if(user.Tower + ammount > user.TownHall * 3)
            return await ctx.reply(' 🏹 Нет места для стольки пушек!', null, TrueKeyBoard);

        if(user.Gold < user.TowerLevel*10*ammount)
            return await ctx.reply(' 🏹 Недостаточно средств!', null, TrueKeyBoard);

        await User.findOneAndUpdate({VK_ID: ctx.message.from_id},{ Gold: user.Gold - user.TowerLevel*10*ammount, Tower: user.Tower + ammount }).exec();
        return await ctx.reply(` 🏹 Вы успешно построили X${ammount} башень!\nСтоимость: ${user.TowerLevel*10*ammount} злата.`, null, TrueKeyBoard);
    }
    else if(args[1].toLowerCase() == 'король')
    {
        if(TownHall < 3)
            return await ctx.reply(' 🏹 У вас недостаточный уровень ратуши!', null, TrueKeyBoard);

        if(user.KingGoblin > 0)
            return await ctx.reply(' 🏹 У вас уже имеется король гоблинов!', null, TrueKeyBoard);

        if(user.Gold < 50)
            return await ctx.reply(' 🏹 Недостаточно средств!', null, TrueKeyBoard);

        await User.findOneAndUpdate({VK_ID: ctx.message.from_id},{ Gold: user.Gold - 50, KingGoblin: 1 }).exec();
        return await ctx.reply(` 🏹 Вы успешно наняли короля гоблинов!\nСтоимость: 50 злата.`, null, TrueKeyBoard);
    }
    else if(args[1].toLowerCase() == 'хранитель')
    {
        if(TownHall < 5)
            return await ctx.reply(' 🏹 У вас недостаточный уровень ратуши!', null, TrueKeyBoard);

        if(user.TheKeeper > 0)
            return await ctx.reply(' 🏹 У вас уже имеется Хранитель!', null, TrueKeyBoard);

        if(user.Gold < 150)
            return await ctx.reply(' 🏹 Недостаточно средств!', null, TrueKeyBoard);

        await User.findOneAndUpdate({VK_ID: ctx.message.from_id},{ Gold: user.Gold - 150, TheKeeper: 1 }).exec();
        return await ctx.reply(` 🏹 Вы успешно наняли хранителя!\nСтоимость: 150 злата.`, null, TrueKeyBoard);
    }
    else return await ctx.reply(' 🏹 Я тебя не понял!', null, TrueKeyBoard);
});
// Функция бота: Команда - <Атаковать>, lower = True
bot.command('атаковать', async (ctx) => {

    // Клавиатура для бота
    let TrueKeyBoard = null;
    let TrueAttackKeyBoard = null;
    if (ctx.message.from_id == ctx.message.peer_id) 
    {
        TrueKeyBoard = MainKeyBoard;
        TrueAttackKeyBoard = AttackKeyBoard;
    }

    if (!await User.findOne({VK_ID: ctx.message.from_id}).exec()) // Проверка регистрации
    {
        if (ctx.message.from_id == ctx.message.peer_id) // Проверка на ввод сообщение на прямую боту
            await RegisterPlayer(ctx.message.from_id); // Регистрация пользователя
        else return true;
    }
    const user = await User.findOne({VK_ID: ctx.message.from_id}).exec(); // Поиск пользователя и запись в переменную
    if(user.War != 0)
        return await ctx.reply(` 🏹 Вы уже находитесь в бою/обороне...`, null, TrueKeyBoard);

    if(user.CampCount == 0)
        return await ctx.reply(` 🏹 У вас не имеется армии для атаки...`, null, TrueKeyBoard);

    if(user.Finder != 0)
    {
        const enemy = await User.findOne({VK_ID: user.Finder}).exec(); // Поиск пользователя и запись в переменную
        await User.findOneAndUpdate({VK_ID: ctx.message.from_id},{ Attack: user.Finder, War: 1, Time: 20 }).exec();
        await User.findOneAndUpdate({VK_ID: user.Finder},{ Guard: ctx.message.from_id, War: 1, Time: 20 }).exec();
        await bot.sendMessage(user.Finder, `🏹 НАПАДЕНИЕ НА ДЕРЕВНЮ!\n\n\
        На деревеню нападет [id${ctx.message.from_id}|${user.Name}]\n\n\
        💂 Стражи выстроились на защиту!\n\
        Атака будет длиться неопределенное время..`);
        return await ctx.reply(` 🏹 НАЧАЛАСЬ АТАКА!\n\n
        Деревня которую вы атакуете [id${user.Finder}|${enemy.Name}]\n\
        Атака будет длиться неопределенное время..`, null, TrueKeyBoard);
    }
    await ctx.reply(` 🏹 Идёт поиск опонента...`, null, TrueAttackKeyBoard);
    let CountPlayers = 0;
    for(const user of await User.find().exec())
    {
        CountPlayers++;
    }
    const random = getRandomInt(CountPlayers);
    if(!await await User.findOne({ID: 1000+random}).exec() || user.ID == 1000+random)
        return await ctx.reply(` 🏹 Произошла ошибка при поиске врага!\nПовторите попытку еще раз!`, null, TrueKeyBoard);
    
    const enemy = await User.findOne({ID: 1000+random}).exec(); // Поиск пользователя и запись в переменную
    await User.findOneAndUpdate({VK_ID: ctx.message.from_id},{ Finder: enemy.VK_ID }).exec();
    await ctx.reply(` 🏹 ВРАГ НАЙДЕН!\n\n\
    На кого нападаите: [id${enemy.VK_ID}|${enemy.Name}]\n\
    🕍 Ратуша: ${enemy.TownHall} уровень\n\
    🛡 Пушек: ${enemy.Cannons} шт.\n\
    🏹 Башни: ${enemy.Tower} шт.\n\n\
    При победе вы получите:
    🏆 Кубков +30\n\
    💰 Золота: ${enemy.Gold- enemy.Gold*40/100}\n\n\
    Для выбора другого опонента, введите: Далее\n\
    Прекратить поиск: Отмена\n\
    Начать атаку на деревню: Атаковать`, null, TrueAttackKeyBoard);
});
// Функция бота: Команда - <Далее>, lower = True
bot.command('далее', async (ctx) => {

    // Клавиатура для бота
    let TrueKeyBoard = null;
    let TrueAttackKeyBoard = null;
    if (ctx.message.from_id == ctx.message.peer_id) 
    {
        TrueKeyBoard = MainKeyBoard;
        TrueAttackKeyBoard = AttackKeyBoard;
    }

    if (!await User.findOne({VK_ID: ctx.message.from_id}).exec()) // Проверка регистрации
    {
        if (ctx.message.from_id == ctx.message.peer_id) // Проверка на ввод сообщение на прямую боту
            await RegisterPlayer(ctx.message.from_id); // Регистрация пользователя
        else return true;
    }
    const user = await User.findOne({VK_ID: ctx.message.from_id}).exec(); // Поиск пользователя и запись в переменную

    if(user.Finder == 0)
        return true;

    if(user.War != 0)
        return await ctx.reply(` 🏹 Вы уже находитесь в бою/обороне...`, null, TrueKeyBoard);

    if(user.CampCount == 0)
        return await ctx.reply(` 🏹 У вас не имеется армии для атаки...`, null, TrueKeyBoard);

    await ctx.reply(` 🏹 Идёт поиск опонента...`, null, TrueAttackKeyBoard);
    let CountPlayers = 0;
    for(const user of await User.find().exec())
    {
        CountPlayers++;
    }
    const random = getRandomInt(CountPlayers);
    if(!await await User.findOne({ID: 1000+random}).exec() || user.ID == 1000+random)
        return await ctx.reply(` 🏹 Произошла ошибка при поиске врага!\nПовторите попытку еще раз!`, null, TrueKeyBoard);
    
    const enemy = await User.findOne({ID: 1000+random}).exec(); // Поиск пользователя и запись в переменную
    await User.findOneAndUpdate({VK_ID: ctx.message.from_id},{ Finder: enemy.VK_ID }).exec();
    await ctx.reply(` 🏹 ВРАГ НАЙДЕН!\n\n\
    На кого нападаите: [id${enemy.VK_ID}|${enemy.Name}]\n\
    🕍 Ратуша: ${enemy.TownHall} уровень\n\
    🛡 Пушек: ${enemy.Cannons} шт.\n\
    🏹 Башни: ${enemy.Tower} шт.\n\n\
    При победе вы получите:
    🏆 Кубков +30\n\
    💰 Золота: ${enemy.Gold- enemy.Gold*40/100}\n\n\
    Для выбора другого опонента, введите: Далее\n\
    Прекратить поиск: Отмена\n\
    Начать атаку на деревню: Атаковать`, null, TrueAttackKeyBoard);
});
// Функция бота: Команда - <Отмена>, lower = True
bot.command('отмена', async (ctx) => {

    // Клавиатура для бота
    let TrueKeyBoard = null;
    if (ctx.message.from_id == ctx.message.peer_id) TrueKeyBoard = MainKeyBoard;

    if (!await User.findOne({VK_ID: ctx.message.from_id}).exec()) // Проверка регистрации
    {
        if (ctx.message.from_id == ctx.message.peer_id) // Проверка на ввод сообщение на прямую боту
            await RegisterPlayer(ctx.message.from_id); // Регистрация пользователя
        else return true;
    }
    const user = await User.findOne({VK_ID: ctx.message.from_id}).exec(); // Поиск пользователя и запись в переменную
    if(user.Finder == 0)
        return true;
        
    if(user.War != 0)
        return await ctx.reply(` 🏹 Вы уже находитесь в бою/обороне...`, null, TrueKeyBoard);
    
    await User.findOneAndUpdate({VK_ID: ctx.message.from_id},{ Finder: 0 }).exec();
    await ctx.reply(` 🏹 Поиск врага был завершен!`, null, TrueKeyBoard);
});
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }
// Отслеживание всех сообщений
bot.event('message_new', async (ctx) => {
    if (!await User.findOne({VK_ID: ctx.message.from_id}).exec()) // Проверка регистрации
        if(ctx.message.from_id == ctx.message.peer_id)
            await RegisterPlayer(ctx.message.from_id); // Регистрация пользователя

    if(ctx.message.from_id == ctx.message.peer_id)
        await ctx.reply('🏹 Данной команды не существует!\nСписок команд: Команды');
});
async function CheckAttack()
{
    for(const user of await User.find({War: 1}))
    {
        if(user.Time - 20 != 0)
        {
            await User.findOneAndUpdate({VK_ID: user.VK_ID},{ Time: user.Time - 20 }).exec();
            continue;
        }

        if(user.Attack == 0) continue;
        const enemy = await User.findOne({VK_ID: user.Attack}).exec();
        let PowerAttack = user.Vikings*user.VikingLevel+user.GoblinLevel*user.Goblins+user.Gigants*user.GigantLevel+user.Dragons*user.DragonLevel+user.Pekka*user.PekkaLevel+user.KingGoblin-15;
        let PowerGuard = enemy.Cannons*enemy.CannonsLevel+enemy.Tower*enemy.TowerLevel+enemy.Guardian*enemy.GuardinLevel;

        if(PowerAttack > PowerGuard)
        {
            await User.findOneAndUpdate({VK_ID: user.VK_ID},{ Wins: user.Wins+1,Cups: user.Cups + 30, Vikings: 0, Goblin: 0, Gigant: 0, Dragon: 0, Pekka: 0, War: 0, Finder:0, Attack: 0, Time: 0, Guard: 0, Gold: user.Gold+ enemy.Gold - enemy.Gold*40/100, CampCount: 0 }).exec();
            await bot.sendMessage(user.VK_ID, `🏹 ПОБЕДА!\n\nВаши бойцы разрушили деревню: [id${enemy.VK_ID}|${enemy.Name}]\n\nНаграда:\n💰 +${enemy.Gold - enemy.Gold*40/100}\n🏆 +30 Кубков`);
            let eCups;
            if(enemy.Cups - 30 <= 0)
                eCups = 0;
            else eCups = enemy.Cups - 30;
            await User.findOneAndUpdate({VK_ID: enemy.VK_ID},{ Cups: eCups, War: 0, Finder:0, Attack: 0, Time: 0, Guard: 0, Gold: enemy.Gold - enemy.Gold*40/100 }).exec();
            await bot.sendMessage(enemy.VK_ID, `🏹 ПОРАЖЕНИЕ!\n\nВаша деревня не выдержала атаку [id${user.VK_ID}|${user.Name}]\n\nПотери:\n💰 -${enemy.Gold - enemy.Gold*40/100}\n🏆 -30 Кубков`);
        }
        else
        {
            let uCups;
            if(user.Cups - 30 <= 0)
            uCups = 0;
            else uCups = user.Cups - 30;
            await User.findOneAndUpdate({VK_ID: user.VK_ID},{ Cups: uCups, Vikings: 0, Goblin: 0, Gigant: 0, Dragon: 0, Pekka: 0, War: 0, Finder:0, Attack: 0, Guard: 0, Time: 0, CampCount: 0 }).exec();
            await bot.sendMessage(user.VK_ID, `🏹 ПОРАЖЕНИЕ!\n\nВаши бойцы не смогли разрешить деревню: [id${enemy.VK_ID}|${enemy.Name}]\n\n🏆 -30 Кубков`);
            await User.findOneAndUpdate({VK_ID: enemy.VK_ID},{ Cups: enemy.Cups+30, Wins: user.Wins + 1, War: 0, Finder:0, Attack: 0, Guard: 0, Time: 0 }).exec();
            await bot.sendMessage(enemy.VK_ID, `🏹 ПОБЕДА!\n\nВаша деревня выдержала атаку [id${user.VK_ID}|${user.Name}]\n\n🏆 +30 Кубков`);
        }
    }
}
bot.startPolling(); 
setInterval(CheckAttack, 20000);
