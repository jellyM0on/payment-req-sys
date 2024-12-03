class RequestsController < ApplicationController

  before_action :authenticate_user!
  before_action :check_role 
  

  def index
    if(@user_role == "admin" || @user_role == "accountant" )
      requests = Request.all
    end

    if(@user_role == "employee")
      requests = Request.find_by(
        user_id: current_user.id
      )
    end

    if(@user_role == "manager")
      requests = Request.joins(:approvals).where(:approvals => {:reviewer => current_user.id}).or(Request.where(user: current_user.id))
    end
 
  render json: requests.to_json(:include => [ {:user => { :only => [:name, :department]}}, { :approvals => { :include => { :reviewer => {:only => :name}}} }])
  end

  

  private

  def check_role
    @user_role = current_user.role
  end

end
