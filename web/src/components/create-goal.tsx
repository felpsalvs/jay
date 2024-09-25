import { X } from 'lucide-react'
import { Button } from './ui/button'
import {
  RadioGroup,
  RadioGroupIndicator,
  RadioGroupItem,
} from './ui/radio-group'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from './ui/dialog'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { z } from 'zod'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createGoal } from '../http/create-goal'
// import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'

const createGoalSchema = z.object({
  title: z.string().min(1, 'Informe a atividade que deseja praticar'),
  desiredWeeklyFrequency: z.coerce.number().min(1).max(7),
})

type CreateGoalSchema = z.infer<typeof createGoalSchema>

export function CreateGoal(){
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    formState: {errors},
    control,
    reset,
  } = useForm<createGoalSchema>({
    resolver: zodResolver(createGoalSchema),
  })

  async function handleCreateGoal({
    title,
    desiredWeeklyFrequency,
  }: CreateGoalSchema) {
    try {
      await createGoal({
        title,
        desiredWeeklyFrequency,
      })

      reset()

      queryClient.invalidateQueries({queryKey: ['pending-goals']})
      queryClient.invalidateQueries({queryKey: ['summary']})

      toast.success('Meta criada com sucesso!')
    } catch {
      toast.error('Erro ao criar a meta, tente novamente!')
    }
  }

  return (
    <DialogContent>
      <div className='flex flex-col gap-6 h-full'>
        <div className='space-y-3'>
          <div className='flex items-center justify-between'>
            <DialogTitle>Cadastrar meta</DialogTitle>
            <DialogClose>
              <X className='size-5 text-zinc-600'/>
            </DialogClose>
          </div>

          <DialogDescription>
          Adicione atividades que te fazem bem e que você quer continuar
          praticando toda semana.
          </DialogDescription>
        </div>

        <form onSubmit={handleSubmit(handleCreateGoal)} className='flex-1 flex flex-col justify-between'>
          <div>
            <div>
              <Label>Qual a atividade?</Label>
              <Input />

              {errors.title && (
                <p>{errors.title.message}</p>
              )}
            </div>
          </div>

        </form>
      </div>
    </DialogContent>
  )
  
}