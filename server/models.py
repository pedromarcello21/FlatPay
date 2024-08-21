from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.ext.declarative import declarative_base
from config import db, bcrypt


friendship_table = db.Table('friendships', db.metadata,
    db.Column('user_id', db.ForeignKey('users.id', ondelete="CASCADE"), primary_key=True),
    db.Column('friend_id', db.ForeignKey('users.id', ondelete="CASCADE"), primary_key=True)
)

class User(db.Model, SerializerMixin):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, nullable=False, unique=True)
    _hashed_password = db.Column(db.String)
    
    @property
    def password(self):
        raise Exception('You may not view password')
    
    @password.setter
    def password(self, value):
        self._hashed_password = bcrypt.generate_password_hash(value).decode('utf-8')
    
    def authenticate(self, password_to_check):
        return bcrypt.check_password_hash(self._hashed_password, password_to_check)

    # Relationships
    transactions_sent = db.relationship('Transaction', foreign_keys='Transaction.requestor', back_populates='sender')
    transactions_received = db.relationship('Transaction', foreign_keys='Transaction.requestee', back_populates='receiver')
    friends_sent = db.relationship('FriendRequest', foreign_keys='FriendRequest.invitor_id', back_populates='invitor')
    friends_received = db.relationship('FriendRequest', foreign_keys='FriendRequest.invitee_id', back_populates='invitee')
    transaction_history = db.relationship('TransactionHistory', foreign_keys='TransactionHistory.user_id', back_populates='user')

    friends = db.relationship(
        'User',
        secondary=friendship_table,
        primaryjoin=(friendship_table.c.user_id == id),
        secondaryjoin=(friendship_table.c.friend_id == id),
        back_populates='befriended_by'
    )
    befriended_by = db.relationship(
        'User',
        secondary=friendship_table,
        primaryjoin=(friendship_table.c.friend_id == id),
        secondaryjoin=(friendship_table.c.user_id == id),
        back_populates='friends'
    )

    # Serialize rules
    serialize_rules = ('-transactions_sent.sender', '-transactions_received.receiver', '-_hashed_password', '-friends_sent.invitor', '-friends_received.invitee', '-friends.befriended_by', '-befriended_by.friends','-friends.friends','-befriended_by.befriended_by','-transaction_history.user')

    def __repr__(self):
        return f"<User {self.username}>"

class Transaction(db.Model, SerializerMixin):
    __tablename__ = "transactions"

    id = db.Column(db.Integer, primary_key=True)
    requestor = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    requestee = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    year = db.Column(db.Integer, nullable=False)
    payment_method = db.Column(db.String)
    status = db.Column(db.String, default='pending')

    # Relationships
    sender = db.relationship('User', foreign_keys=[requestor], back_populates='transactions_sent')
    receiver = db.relationship('User', foreign_keys=[requestee], back_populates='transactions_received')
    history = db.relationship('TransactionHistory', back_populates='transaction', cascade='all, delete-orphan')

    serialize_rules = ('-sender', '-receiver', '-history')
    def __repr__(self):
        return f"<Transaction from {self.requestor} to {self.requestee}, amount: {self.amount}, year: {self.year}, status: {self.status}>"

## FRIEND REQUEST MODEL ###############################################################################################
class FriendRequest(db.Model, SerializerMixin):
    __tablename__ = 'friend_requests'

    id = db.Column(db.Integer, primary_key=True)
    invitor_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    invitee_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    status = db.Column(db.String, default='pending')

    # Relationships
    invitor = db.relationship('User', foreign_keys=[invitor_id], back_populates='friends_sent')
    invitee = db.relationship('User', foreign_keys=[invitee_id], back_populates='friends_received')
    
    # Serialize rules
    serialize_rules = ('-invitor', '-invitee')

    def __repr__(self):
        return f"<Friend request from {self.invitor} to {self.invitee}>"
    
## END FRIEND REQUEST MODEL ###############################################################################################
## TRANSACTION HISTORY MODEL ###############################################################################################

class TransactionHistory(db.Model, SerializerMixin):
    __tablename__ = "transaction_history"

    id = db.Column(db.Integer, primary_key=True)
    transaction_id = db.Column(db.Integer, db.ForeignKey('transactions.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    other_user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    year = db.Column(db.Integer, nullable=False)
    status = db.Column(db.String, nullable=False)
    payment_method = db.Column(db.String, nullable=False)
    transaction_type = db.Column(db.String, nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())

    transaction = db.relationship('Transaction', back_populates='history')
    user = db.relationship('User', foreign_keys=[user_id], back_populates='transaction_history')
    other_user = db.relationship('User', foreign_keys=[other_user_id])

    serialize_rules = ('-user', '-other_user', '-transaction')

## END TRANSACTION HISTORY MODEL ###############################################################################################