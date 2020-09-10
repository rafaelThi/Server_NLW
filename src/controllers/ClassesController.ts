import { Request, Response } from 'express'

import db from '../database/connection';
import convertHours from '../utils/covertHours';


interface SCitem{
    weekday:number;
    from:string;
    to:string;
}

export default class ClassesController {

    async index(request: Request, response: Response) {
        const filters = request.query;

        const subject = filters.subject as string
        const weekday = filters.weekday as string
        const time = filters.time as string

        if(!filters.weekday || !filters.subject || !filters.time){
            return response.status(400).json({
                error:'Missing filters to searsch classes'
            })
        }

        const timeInMinutes = convertHours(time);

        const classes = await db('classes')
            .whereExists(function(){
                this.select('class_schedu.*')
                    .from('class_schedu')
                    .whereRaw('`class_schedu`.`class_id` = `classes`.`id`')
                    .whereRaw('`class_schedu`.`weekday` = ??', [Number(weekday)])
                    .whereRaw('`class_schedu`. `from` <= ??', [timeInMinutes])
                    .whereRaw('`class_schedu`. `to` > ??', [timeInMinutes])
            })
            .where('classes.subject', '=', subject)
            .join('users', 'classes.user_id', '=','users.id')
            .select(['classes.*', 'users.*']);

        return response.json(classes);

    }



    async create(request: Request, response: Response){
        const {
            name,
            avatar,
            whatsapp,
            bio,
            subject,
            cost,
            sc
        } = request.body;
    
        const trx = await db.transaction();
    
    try {
        const usersIds =  await trx('users').insert({
            name,
            avatar,
            whatsapp,
            bio
          })
        
        const user_id=usersIds[0];
        
        const classesIds = await trx('classes').insert({
            subject,
            cost,
            user_id
          })
          
        const  class_id = classesIds[0];
        
        
         const classSC = sc.map((scItem: SCitem) =>{
             return{
                 class_id,
                 weekday: scItem.weekday,
                 from: convertHours(scItem.from),
                 to: convertHours(scItem.to)
        
             }
         })
         await trx('class_schedu').insert(classSC)
        
        
         await trx.commit();
    
          return response.status(201).send();
    
    
    } catch (err){
        console.log(err)
        
    
        await trx.rollback();
    
        return response.status(400).json({
            error:'Erro inesperado'
        })
    }
    }
}