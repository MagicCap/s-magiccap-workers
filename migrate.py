import requests
import rethinkdb
import os

r = rethinkdb.RethinkDB()

conn = r.connect(host="rethinkdb-rethinkdb-cluster", password="rethinkdb")

data = r.db("magiccap").table("shortened_links").coerce_to("array").run(conn)
cf_data = []
for d in data:
    cf_data.append({"key": d['id'], "value": d['url']})

req = requests.put(f"https://api.cloudflare.com/client/v4/accounts/{os.environ['ACCOUNT_ID']}/storage/kv/namespaces/7ba7e0be57d84fa5ad92c6ecfe22b240/bulk", json=cf_data, headers={"X-Auth-Email": os.environ['EMAIL'], "X-Auth-Key": os.environ['KEY'], "Content-Type": "application/json"})
print(req.text)
req.raise_for_status()
print("Done!")
