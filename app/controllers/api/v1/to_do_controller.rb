class Api::V1::ToDoController < ApplicationController
  def index
    @to_dos = ToDo.includes(:tags).all
    render json: @to_dos.to_json(:include => :tags)
  end

  def create
    params = to_do_params
    keyset = [:title, :description, :start_date, :due_date, :priority, :supertask_id]
    params_for_to_do = params.slice!(*keyset)

    #Add to_do
    @to_do = ToDo.create!(params_for_to_do)

    #Add tags
    for tag in to_do_params[:tags] do
      @tag = @to_do.tags.create({
        to_do_id: @to_do.id,
        tag: tag
      });

      if !@tag
        render json: @tag.errors
      end
    end

    #render response
    if @to_do
      render json: @to_do
    else
      render json: @to_do.errors
    end
  end

  def new

  end

  def edit

  end

  def show
    @to_do = ToDo.includes(:tags, :subtasks).find(params[:id])

    if @to_do
      render json: @to_do.to_json(:include => [:tags, :subtasks])
    else
      render json: @to_do.errors
    end
  end

  def update
    @to_do = ToDo.find(params[:id])

    if @to_do
      #Update to do
      params = to_do_params
      keyset = [:title, :description, :start_date, :due_date, :priority, :completed]
      params_for_to_do = params.slice!(*keyset)
      puts params_for_to_do
      @to_do.update(params_for_to_do)

      puts 'updating completed'
      update_completed(@to_do)

      #Update tags
      if @to_do.tags.length > 0
        @to_do.tags.each { |tag| tag.destroy }
      end

      if(to_do_params[:tags])
        for tag in to_do_params[:tags] do
          @tag = @to_do.tags.create({
            to_do_id: @to_do.id,
            tag: tag
          });

          if !@tag
            render json: @tag.errors
          end
        end
      end

      render json: @to_do
    else
      render json: @to_do.errors
    end
  end

  def destroy
    @to_do = ToDo.find(params[:id])
    @to_do.destroy
    render json: { message: 'Item Deleted!'}
  end

  def get_tags
    @tags = Tag.distinct.pluck(:tag)

    render json: @tags
  end

  private
    def to_do_params
      params.permit(:title,
                    :description,
                    :start_date,
                    :due_date,
                    :priority,
                    {:tags => []},
                    :supertask_id,
                    :completed)
    end

    def update_completed(to_do)
      #Updates completed status of all Subtasks
      to_do.subtasks.each { |subtask|
        subtask.update({completed: to_do.completed})
        update_completed(subtask)
      }
    end
end
