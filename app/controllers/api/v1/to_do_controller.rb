class Api::V1::ToDoController < ApplicationController
  def index
    @to_dos = ToDo.all
    render json: @to_dos
  end

  def create
    @to_do = ToDo.create!(to_do_params)
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
    @to_do = ToDo.find(params[:id])
    if @to_do
      render json: @to_do
    else
      render json: @to_do.errors
    end
  end

  def update
    @to_do = ToDo.find(params[:id])
    if @to_do
      @to_do.update(to_do_params)
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

  private
    def to_do_params
      params.permit(:title, :description, :start_date, :due_date)
    end
end
